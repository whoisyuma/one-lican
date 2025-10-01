'use client'

import { useState } from "react";
import { createPayment } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Member {
  id: string;
  name: string;
}

interface PaymentFormProps {
  members: Member[];
  groupId: string;
}

export default function PaymentForm({ members, groupId }: PaymentFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // action.tsへデータを渡す
  const handleAction = async (formData: FormData) => {
    const result = await createPayment(formData);
    if (result?.error) {
      setError(result.error);
    } else if (result.success && result.paymentId) {
      router.push(`/group/${groupId}/home`);
    }
  }

  return (
      <form action={handleAction}>
        {error && <p className="text-red-500 text-sm mb-5">{error}</p>}
        <input type="hidden" name="groupId" value={groupId}/>

        <div className="flex justify-between border-b border-sky-600 pb-8 mb-8">
          <label htmlFor="paidBy" className="text-xl font-bold text-gray-700">立替者</label>
          <select name="paidBy" id="paidBy" required className="border rounded-md shadow-sm">
              {members.map((member) => (
                  <option key={member.id} value={member.id}>{member.name}</option>
              ))}
          </select>
        </div>

        <div className="flex justify-between border-b border-sky-600 pb-8 mb-8">
          <h2 className="text-xl font-bold text-gray-700">負担者</h2>
          <div className="space-y-1">
              {members.map((member) => (
                  <div key={member.id} className="flex items-center">
                      <input type="checkbox" name="sharedBy" value={member.id} id={`sharedBy-${member.id}`} className="h-4 w-4"/>
                      <label htmlFor={`sharedBy-${member.id}`} className="ml-2">
                          {member.name}
                      </label>
                  </div>
              ))}
          </div>
        </div>

        <div className="flex justify-between border-b border-sky-600 pb-8 mb-8">
          <label htmlFor="description" className="text-xl font-bold text-gray-700">支払い内容</label>
          <input type="text" id="description" name="description" required className="border rounded-md shadow-sm mt-1"/>
        </div>

        <div className="flex justify-between pb-8 mb-8">
          <label htmlFor="amount" className="text-xl font-bold text-gray-700">金額</label>
          <input type="number" id="amount" name="amount" required className="border rounded-md shadow-sm mt-1"/>
        </div>

        <div className="flex justify-center">
          <button type="submit" className="bg-sky-600 text-white rounded-md py-2 w-2/3">
            立て替えを記録
          </button>
        </div>
      </form>
  )
}