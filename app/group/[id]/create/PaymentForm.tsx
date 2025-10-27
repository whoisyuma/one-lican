'use client'

import React, { useState, useTransition } from "react";
import { createPayment } from "./actions";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

interface Member {
  id: string;
  name: string;
}

interface PaymentFormProps {
  members: Member[];
  groupId: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="bg-sky-600 hover:bg-sky-700 duration-200 text-white md:text-base text-sm rounded-md py-2 w-1/2">
      {pending ? '記録中...' : '立て替えを記録'}
    </button>
  )
}

export default function PaymentForm({ members, groupId }: PaymentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

  // 戻るボタンの処理
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startTransition(() => {
      router.push(`/group/${groupId}/home`)
    })
  }

  return (
      <form action={handleAction}>
        {error && <p className="text-red-500 text-sm mb-5">{error}</p>}
        <input type="hidden" name="groupId" value={groupId}/>

        <div className="flex justify-between items-center border-b border-sky-600 pb-8 mb-8">
          <label htmlFor="paidBy" className="md:text-xl text-lg font-bold text-gray-700">立替者</label>
          <select name="paidBy" id="paidBy" required className="border rounded-md md:p-1 p-0.5 bg-white shadow-sm">
              {members.map((member) => (
                  <option key={member.id} value={member.id}>{member.name}</option>
              ))}
          </select>
        </div>

        <div className="flex justify-between border-b border-sky-600 pb-8 mb-8">
          <h2 className="md:text-xl text-lg font-bold text-gray-700">負担者</h2>
          <div className="space-y-1">
              {members.map((member) => (
                  <div key={member.id} className="flex items-center">
                      <input type="checkbox" name="sharedBy" value={member.id} id={`sharedBy-${member.id}`} className="h-4 w-4 accent-sky-600"/>
                      <label htmlFor={`sharedBy-${member.id}`} className="ml-2">
                          {member.name}
                      </label>
                  </div>
              ))}
          </div>
        </div>

        <div className="flex justify-between items-center border-b border-sky-600 pb-8 mb-8">
          <label htmlFor="description" className="md:text-xl text-lg font-bold text-gray-700">支払い内容</label>
          <input type="text" id="description" name="description" placeholder="昼食代" required className="border rounded-md shadow-sm bg-white p-1"/>
        </div>

        <div className="flex justify-between items-center pb-8 mb-8">
          <label htmlFor="amount" className="md:text-xl text-lg font-bold text-gray-700">金額</label>
          <input type="number" id="amount" name="amount" required placeholder="5000" className="border rounded-md shadow-sm bg-white p-1"/>
        </div>

        <div className="flex md:space-x-3 space-x-2">
          <button type="button" onClick={handleClick} className="rounded-md border border-gray-400 md:text-base text-sm py-2 w-1/2 text-center bg-gray-100 hover:bg-gray-200 duration-200">
            {isPending ? '読み込み中...' : 'ホームへ戻る'}
          </button>
          <SubmitButton/>
        </div>
      </form>
  )
}