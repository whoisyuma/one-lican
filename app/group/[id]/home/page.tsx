import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import AddPaymentLink from "@/components/AddPaymentLink";

interface Member {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
  members: Member[];
}

interface Payment {
  id: string;
  group_id: string;
  paid_by_member_id: string;
  amount: number;
  description: string;
  created_at: string;
}

interface Share {
  id: string;
  payment_id: string;
  member_id: string;
  amount: number;
  created_at: string;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

interface PageProps {
  params: Promise<{id: string}>;
}

export default async function GroupHome({ params }: PageProps) {
  const supabase = await createClient();
  const { id: groupId } = await params;

  const [groupResult, paymentsResult] = await Promise.all([
    supabase
      .from('groups')
      .select('id, name, members')
      .eq('id', groupId)
      .single(),
    supabase
      .from('payments')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false }),
  ]);

  if (groupResult.error || paymentsResult.error) {
    console.error(groupResult.error || paymentsResult.error);
    return;
  }

  const paymentIds = paymentsResult.data.map((p) => p.id);
  const { data: sharesData, error: sharesError } = await supabase
    .from('shares')
    .select('*')
    .in('payment_id', paymentIds);

  if (sharesError) {
    console.error(sharesError);
    return;
  }

  const group: Group = groupResult.data;
  const payments: Payment[] = paymentsResult.data || [];
  const shares: Share[] = sharesData || [];

  const memberMap = new Map<string, string>();
  group.members.forEach(member => {
    memberMap.set(member.id, member.name);
  })

  const totalShares = new Map<string, number>();
  const balances = new Map<string, number>();

  group.members.forEach(member => {
    balances.set(member.id, 0);
    totalShares.set(member.id, 0);
  });

  payments.forEach(payment => {
    const currentBalance = balances.get(payment.paid_by_member_id) || 0;
    balances.set(payment.paid_by_member_id, currentBalance + payment.amount);
  });

  shares.forEach(share => {
    const currentBalance = balances.get(share.member_id) || 0;
    balances.set(share.member_id, currentBalance - share.amount);

    const currentShare = totalShares.get(share.member_id) || 0;
    totalShares.set(share.member_id, currentShare + share.amount);
  });

  const creditors: { id: string; balance: number }[] = [];
  const debtors: { id: string; balance: number }[] = [];
  balances.forEach((balance, id) => {
    if (balance > 0) {
      creditors.push({ id, balance });
    } else if (balance < 0) {
      debtors.push({ id, balance });
    }
  });

  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;

  const EPS = 0.0001;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    const amountToSettle = Math.min(creditor.balance, -debtor.balance);

    settlements.push({
      from: debtor.id,
      to: creditor.id,
      amount: amountToSettle,
    });

    creditor.balance -= amountToSettle;
    debtor.balance += amountToSettle;

    if (Math.abs(creditor.balance) < EPS) {
      creditor.balance = 0;
      i++;
    }
    if (Math.abs(debtor.balance) < EPS) {
      debtor.balance = 0;
      j++;
    }
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="lg:w-1/2 md:w-2/3 w-full m-auto px-5 md:px-0 pt-10">
        <div className="mb-15">
          <h1 className="md:text-4xl text-2xl font-bold md:mb-3 mb-2">
            {group?.name}
          </h1>
          <div className="flex">
            <p className="md:text-sm text-xs">
              メンバー：{group?.members.map((member: Member) => member.name).join('・')}
            </p>
          </div>
        </div>

        <section className="mb-20 md:mb-25 lg:mb-30 lg:w-2/3">
          <h1 className="md:text-2xl text-xl font-bold mb-5 border-b border-sky-600 pb-2">
            精算方法
          </h1>
          {settlements.length > 0 ? (
            <div className="space-y-1">
              {settlements.map((settlement, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex">
                    <p className="font-semibold">
                      {memberMap.get(settlement.from)}
                    </p>
                    <span className="mx-2">
                      →
                    </span>
                    <p className="font-semibold">
                      {memberMap.get(settlement.to)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {Math.ceil(settlement.amount).toLocaleString()}円
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm md:text-base">
              精算の必要はありません。
            </p>
          )}
        </section>

        <section className="mb-20 md:mb-25 lg:mb-30 lg:w-2/3">
          <h1 className="md:text-2xl text-xl font-bold mb-5 border-b border-sky-600 pb-2">
            支出額
          </h1>
          <div className="space-y-1">
            {group.members.map((member) => {
              const amount = totalShares.get(member.id) || 0;

              return (
                <div key={member.id}  className="flex justify-between">
                  <span className="font-semibold">
                    {member.name}
                  </span>
                  <span className="font-semibold">
                    {Math.round(amount).toLocaleString()}円
                  </span>
                </div>
              )
              })}
          </div>
        </section>

        <section className="pb-10">
          <div className="border-b border-sky-600 pb-2 mb-2 flex justify-between items-center">
            <h1 className="md:text-2xl text-xl font-bold">
              立替一覧
            </h1>
            <AddPaymentLink
              href={`/group/${group?.id}/create`}
              className="bg-sky-600 hover:bg-sky-700 duration-200 text-center text-white md:text-base text-sm rounded-md md:py-1.5 py-1 md:px-5 px-3 cursor-pointer"
            >
              立替を追加
            </AddPaymentLink>
          </div>
          {payments.length > 0 ? (
            <div>
              {payments.map((payment) => {
                const paymentShares = shares.filter(s => s.payment_id === payment.id);
                const paidByName = memberMap.get(payment.paid_by_member_id) || '不明';

                return (
                  <div key={payment.id} className="flex justify-between items-center border-b border-sky-600 py-5">
                    <div>
                      <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">
                            {payment.description}
                          </h3>
                          <span className="text-xs text-gray-700">
                            ({new Date(payment.created_at)
                              .toLocaleDateString(
                                'ja-JP', { month: 'numeric', day: 'numeric' }
                              )
                            })
                          </span>
                          <Link href={`/group/${groupId}/payments/${payment.id}/edit`}>
                              <img 
                                src="/icons/edit.svg" 
                                alt="編集アイコン" 
                                className="w-4 h-4"
                              />
                          </Link>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        立替人：{paidByName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        負担者：{paymentShares
                          .map(share => memberMap.get(share.member_id) || '不明')
                          .join('、 ')
                        }
                      </p>
                    </div>
                    <p className="font-semibold">
                      {payment.amount.toLocaleString()}円
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="pt-3 text-sm md:text-base">
              まだ立て替えは記録されていません。
            </p>
          )}
        </section>
      </div>
    </div>
  )
}