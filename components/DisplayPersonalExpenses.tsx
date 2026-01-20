'use client';

import { useState } from "react";

interface MemberExpenseDetail {
  paymentId: string;
  description: string;
  amount: number;
  created_at: string;
}

interface MemberExpense {
  memberId: string;
  name: string;
  total: number;
  details: MemberExpenseDetail[];
}

interface Props {
  data: MemberExpense[];
}

export default function DisplayPersonalExpenses({ data }: Props) {
  const [openMembers, setOpenMembers] = useState<Record<string, boolean>>({});

  const toggleMember = (memberId: string) => {
    setOpenMembers((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  return (
    <section className="mb-20 md:mb-25 lg:mb-30 lg:w-2/3">
      <h1 className="md:text-2xl text-xl font-bold mb-5 border-b border-sky-600 pb-2">
        支出額
      </h1>
      <div className="space-y-1">
        {data.map((member) => {
          const isOpen = openMembers[member.memberId];

          return (
            <div key={member.memberId}>
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {member.name}
                </span>

                <div className="flex items-center">
                  <span className="font-semibold">
                    {member.total.toLocaleString()}円
                  </span>

                  <button
                    onClick={() => toggleMember(member.memberId)}
                    className="ml-3 mt-0.5 w-11 text-center text-sky-600 text-sm font-medium hover:underline"
                  >
                    {isOpen ? '閉じる' : '内訳'}
                  </button>
                </div>
              </div>

              {isOpen && member.details.length > 0 && (
                <div className="py-5 mb-5 border-b border-b-sky-600">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2 underline">
                    内訳
                  </h3>
                  {member.details.map((detail) => (
                    <div 
                      key={detail.paymentId} 
                      className="flex justify-between items-start space-y-0.5"
                    >
                      <div className="flex flex-1 min-w-0">
                        <span className="text-gray-600 select-none">
                          ・
                        </span>
                        <div className="flex items-start space-x-2 min-w-0">
                          <h3 className="font-semibold break-words">
                            {detail.description}
                          </h3>
                          <span className="text-xs text-gray-600 mt-1">
                            ({new Date(detail.created_at)
                              .toLocaleDateString(
                                'ja-JP', { month: 'numeric', day: 'numeric' }
                              )
                            })
                          </span>
                        </div>
                      </div>
                      <p className="font-semibold shrink-0 w-22 text-right whitespace-nowrap">
                        {Math.round(detail.amount).toLocaleString()}円
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}