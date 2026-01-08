'use server'

import { createClient } from "@/utils/supabase/server";

export async function updatePayment(formData: FormData) {
  const supabase = await createClient();
  const paymentId = formData.get('paymentId') as string;
  const description = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const paidBy = formData.get('paidBy') as string;
  const sharedBy = formData.getAll('sharedBy') as string[];

  if (
    !description 
    || isNaN(amount) 
    || amount <= 0 
    || !paidBy 
    || sharedBy.length === 0
  ) {
    return { error: 'すべての項目を正しく入力してください。' };
  }

  try {
    const { error: paymentError } = await supabase
      .from('payments')
      .update({description, amount, paid_by_member_id: paidBy})
      .eq('id', paymentId);

    if (paymentError) {
      console.error('支払い更新エラー：', paymentError);
      return { error: '支払いの更新に失敗しました。'};
    }

    const { error: deleteSharesError } = await supabase
      .from('shares')
      .delete()
      .eq('payment_id', paymentId);

    if (deleteSharesError) {
      console.error('負担者のデータ削除エラー：', deleteSharesError);
      return { error: '既存の負担者のデータの削除に失敗しました。'};
    }

    const sharedAmount = amount / sharedBy.length;
    const sharesToInsert = sharedBy.map(memberId => ({
      payment_id: paymentId,
      member_id: memberId,
      amount: sharedAmount,
    }));

    const { error: insertSharesError } = await supabase
      .from('shares')
      .insert(sharesToInsert);

    if (insertSharesError) {
      console.error('新しい負担者のデータ挿入エラー：', insertSharesError);
      return { error: '新しい負担者のデータの作成に失敗しました。'}
    }

    return {success: true};
  } catch (e) {
    console.error('予期せぬエラー：', e);
    return { error: '支払いの更新中に予期せぬエラーが発生しました。'};
  }
}

export async function deletePayment(formData: FormData) {
  const supabase = await createClient();
  const paymentId = formData.get('paymentId') as string;

  try {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', paymentId);

    if (error) {
      console.error('支払い削除エラー：', error);
      return { error: '支払いの削除に失敗しました。' };
    }

    return { success: true };
  } catch (e) {
    console.error('予期せぬエラー：', e);
    return { error: '支払いの削除中に予期せぬエラーが発生しました。'};
  }
}