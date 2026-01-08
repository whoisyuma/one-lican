import EditPaymentForm from "@/components/EditPaymentForm";
import { createClient } from "@/utils/supabase/server";

interface Member {
  id: string;
  name: string;
}

interface Payment {
  id: string;
  group_id: string;
  paid_by_member_id: string;
  amount: number;
  description: string;
}

interface Share {
  member_id: string;
  amount: number;
}

interface PageProps {
  params: Promise<{id: string; payment_id: string}>;
}

export default async function EditPaymentPage({params}: PageProps) {
  const { id: groupId, payment_id: paymentId } = await params;
  const supabase = await createClient();

  const { data: groupData, error: groupError } = await supabase
    .from('groups')
    .select('members')
    .eq('id', groupId).single();

  if (groupError || !groupData) {
    console.error('グループメンバーの取得エラー：', groupError);
  }

  const members: Member[] = groupData?.members || [];

  const { data: paymentData, error: paymentError } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId).single();
  
  const { data: sharesData, error: sharesError } = await supabase
    .from('shares')
    .select('*')
    .eq('payment_id', paymentId);

  if (paymentError || !paymentData || sharesError || !sharesData) {
    console.error('支払い情報の取得エラー：', paymentError || sharesError);
  }

  const payment: Payment = paymentData;
  const shares: Share[] = sharesData ?? [];

  const sharedByMemberIds = shares.map(s => s.member_id);

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="lg:w-1/2 md:w-2/3 w-full m-auto px-5 md:px-0 pt-10">
        <EditPaymentForm 
          groupId={groupId}
          paymentId={paymentId}
          members={members}
          initialPayment={payment}
          initialShares={sharedByMemberIds}
        />
      </div>
    </div>
  )
}