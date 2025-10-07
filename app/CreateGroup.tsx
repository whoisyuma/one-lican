'use client'

import { useState } from "react"
import { createGroup } from "./actions";
import { useRouter } from "next/navigation";

export default function CreateGroup() {
    const [members, setMembers] = useState<string[]>([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    // メンバーの追加ボタン
    const addMember = () => {
      if (newMemberName.trim() !== '') {
        setMembers([...members, newMemberName.trim()]);
        setNewMemberName('');
      }
    }

    // メンバーの削除ボタン
    const removeMember = (index: number) => {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    }

    // 入力内容のバリデーションを行い、action.tsへデータを渡す
    const handleAction = async (formData: FormData) => {
      if (members.length < 2) {
        setError('メンバーは2人以上必要です。');
        return;
      }

      const result = await createGroup(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success && result.groupId) {
        router.push(`/group/${result.groupId}`);
      }
    }

    return (
        <form action={handleAction}>
          {error && <p className="text-red-500 text-sm mb-5">{error}</p>}

          <div className="mb-8">
            <label className="font-semibold">グループ名</label>
            <input type="text" id="groupName" name="groupName" placeholder="グループ名" required className="pl-2 mt-2 block lg:w-2/3 w-full py-1 rounded-md border-2 border-gray-400 bg-white shadow-sm"/>
          </div>

          <div className="mb-15">
            <h2 className="font-semibold">メンバー名</h2>
            <div className="mb-5">
              <input 
                type="text" 
                value={newMemberName} 
                onChange={(e) => setNewMemberName(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addMember();
                  }
                }} 
                placeholder="メンバー名" 
                className="pl-2 mt-2 mr-2 lg:w-2/5 w-2/3 py-1 rounded-md border-2 border-gray-400 bg-white shadow-sm"
              />
              <button type="button" onClick={addMember} className="bg-sky-600 text-white rounded-md px-5 py-1">
                追加
              </button>
            </div>

            <div className="flex flex-wrap items-center">
              {members.map((name, index) => (
                <div key={index} className="flex items-center mr-2 py-1 px-3 mb-2 border rounded-3xl">
                  <span className="mr-2">{name}</span>
                  <input type="hidden" name="memberName" value={name}/>
                  <button type="button" onClick={() => removeMember(index)} className="text-xl">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button type="submit" className="bg-sky-600 text-white rounded-md py-2 w-2/3">
              グループを作成
            </button>
          </div>
        </form>
    )
}