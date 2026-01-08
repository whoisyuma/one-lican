'use client'

import { deletePayment, updatePayment } from "@/app/group/[id]/payments/[payment_id]/edit/actions";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";

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

interface EditPaymentFormProps {
  groupId: string;
  paymentId: string;
  members: Member[];
  initialPayment: Payment;
  initialShares: string[];
}

function UpdatePaymentButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="bg-sky-600 hover:bg-sky-700 duration-200 text-white md:text-base text-sm rounded-md py-2 w-1/2"
    >
      {pending ? '更新中...' : '更新する'}
    </button>
  )
}

function DeletePaymentButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="rounded-md bg-red-500 hover:bg-red-600 duration-200 text-white md:text-base text-sm py-2 w-1/2"
    >
      {pending ? '削除中...' : '削除する'}
    </button>
  )
}

export default function EditPaymentForm({ 
  groupId, 
  paymentId, 
  members, 
  initialPayment, 
  initialShares,
}: EditPaymentFormProps) {
  const [error, setError] = useState<string | null>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUpdate = async (formData: FormData) => {
    setError(null);
    formData.append('groupId', groupId);
    formData.append('paymentId', paymentId);
    const result = await updatePayment(formData);
    if (result?.error) {
      setError(result.error);
    } else if (result.success) {
      router.push(`/group/${groupId}/home`);
    }
  }

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (window.confirm('本当にこの立て替えを削除しますか？')) {
      const formData = new FormData(e.currentTarget);
      formData.append('groupId', groupId);
      formData.append('paymentId', paymentId);
      const result = await deletePayment(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result.success) {
        router.push(`/group/${groupId}/home`);
      }
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startTransition(() => {
      router.push(`/group/${groupId}/home`)
    })
  }

  return (
    <div>
      <form action={handleUpdate}>
        {error && 
          <p className="text-red-500 text-sm mb-5">
            {error}
          </p>
        }
        <input type="hidden" name="groupId" value={groupId}/>
        <input type="hidden" name="paymentId" value={paymentId}/>

        <div className="flex justify-between items-center border-b border-sky-600 pb-8 mb-8">
          <label htmlFor="paidBy" className="md:text-xl text-lg font-bold text-gray-700">
            立替者
          </label>
          <select 
            name="paidBy" 
            id="paidBy" 
            required 
            defaultValue={initialPayment.paid_by_member_id} 
            className="border rounded-md md:p-1 p-0.5 bg-white shadow-sm"
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between border-b border-sky-600 pb-8 mb-8">
          <h2 className="md:text-xl text-lg font-bold text-gray-700">
            負担者
          </h2>
          <div className="space-y-1">
            {members.map((member) => (
              <div key={member.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  name="sharedBy" 
                  value={member.id} 
                  id={`sharedBy-${member.id}`} 
                  defaultChecked={initialShares.includes(member.id)} 
                  className="h-4 w-4 accent-sky-600"
                />
                <label htmlFor={`sharedBy-${member.id}`} className="ml-2">
                  {member.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center border-b border-sky-600 pb-8 mb-8">
          <label htmlFor="description" className="md:text-xl text-lg font-bold text-gray-700">
            支払い内容
          </label>
          <input 
            type="text" 
            id="description" 
            name="description" 
            placeholder="昼食代" 
            defaultValue={initialPayment.description} 
            required 
            className="border rounded-md shadow-sm bg-white p-1"
          />
        </div>

        <div className="flex justify-between items-center pb-8 mb-8">
          <label htmlFor="amount" className="md:text-xl text-lg font-bold text-gray-700">
            金額
          </label>
          <input 
            type="number" 
            id="amount" 
            name="amount" 
            required 
            placeholder="5000" 
            defaultValue={initialPayment.amount} 
            className="border rounded-md shadow-sm bg-white p-1"
          />
        </div>

        <div className="flex justify-center space-x-3 mb-3">
          <button 
            type="button" 
            onClick={handleClick} 
            className="rounded-md border border-gray-400 md:text-base text-sm py-2 w-1/2 text-center bg-gray-100 hover:bg-gray-200 duration-200"
          >
            {isPending ? '読み込み中...' : 'ホームへ戻る'}
          </button>
          <UpdatePaymentButton/>
        </div>
      </form>

      <form onSubmit={handleDelete} className="flex justify-center">
        <DeletePaymentButton/>
      </form>
    </div>
  )
}