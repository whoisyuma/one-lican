'use server'

import { createClient } from "@/utils/supabase/server";

export async function createPayment(formData: FormData) {
    const supabase = await createClient();

    // データの取得
    const groupId = formData.get('groupId') as string;
    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const paidBy = formData.get('paidBy') as string;
    const sharedBy = formData.getAll('sharedBy') as string[];

    // バリデーション
    if (!description || isNaN(amount) || amount <= 0 || !paidBy || sharedBy.length === 0) {
        return { error: 'すべての項目を正しく入力してください。' };
    }

    try {
        // paymentsテーブルにデータを挿入
        const { data: paymentData, error: paymentError } = await supabase
            .from('payments')
            .insert([{
                group_id: groupId,
                paid_by_member_id: paidBy,
                amount: amount,
                description: description,
            }])
            .select('id');

        if (paymentError) {
            console.error('支払い作成エラー：', paymentError);
            return { error: '支払いの作成に失敗しました。' };
        }

        // sharesテーブル用にデータを用意
        const paymentId = paymentData[0].id;
        const sharedAmount = amount / sharedBy.length;

        // sharesテーブルにデータを挿入
        const sharesToInsert = sharedBy.map(memberId => ({
            payment_id: paymentId,
            member_id: memberId,
            amount: sharedAmount,
        }));

        const { error: sharesError } = await supabase.from('shares').insert(sharesToInsert);

        if (sharesError) {
            console.error('分担作成エラー：', sharesError);
            return { error: '分担の作成に失敗しました。' };
        }

        // 成功した場合
        return { success: true, paymentId};
    } catch (e) {
        console.error('予期せぬエラー：', e);
        return { error: '支払いの作成中に予期せぬエラーが発生しました。'};
    }
    

    
}