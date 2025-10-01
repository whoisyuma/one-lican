import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

interface PageProps {
    params: Promise<{id: string}>;
}

export default async function GroupPage({ params }: PageProps) {
    const { id: groupId } = await params;
    const supabase = await createClient();

    // SupabaseからGroupテーブルからデータを取得
    const { data: groupData, error: groupError } = await supabase.from('groups').select('id').eq('id', groupId).single();

    if (groupError || !groupData) {
        console.error('グループデータの取得エラー：', groupError);
    }

    const group = groupData;
    
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="w-1/2 m-auto pt-10">
                <div className="flex flex-col items-center mb-10">
                    <img src="/check.png" alt="チェックマーク" className="w-25 h-25 mb-15"/>
                    <h1 className="text-2xl font-bold mb-5">グループを作成しました！</h1>
                    <p className="text-lg">グループページのURLをコピーして、メンバーに共有しましょう。</p>
                </div>

                <div className="mb-10 flex justify-center">
                    <h1 className="text-xl border rounded-xl px-7 py-2">http://localhost:3000/group/{group?.id}/home</h1>
                </div>

                <div className="flex justify-center">
                    <Link href={`/group/${group?.id}/home`} className="bg-sky-600 text-center text-white rounded-md text-xl py-3 w-2/3">
                        グループページへ進む
                    </Link>
                </div>
            </div>
        </div>
    )
}