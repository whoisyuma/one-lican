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
            <div className="lg:w-1/2 md:w-2/3 w-full m-auto px-5 md:px-0 pt-10">
                <div className="flex flex-col items-center mb-10">
                    <img src="/check.png" alt="チェックマーク" className="md:w-25 md:h-25 w-20 h-20 mb-15"/>
                    <h1 className="md:text-2xl text-xl font-bold mb-5">グループを作成しました！</h1>
                    <p className="md:text-lg text-sm text-center">グループページのURLをコピーして、メンバーに共有しましょう。</p>
                </div>

                <div className="mb-10 flex justify-start border-2 rounded-xl px-3 py-1 md:py-2 overflow-x-auto">
                    <h1 className="md:text-xl text-base whitespace-nowrap">https://one-lican.vercel.app/group/{group?.id}/home</h1>
                </div>

                <div className="flex justify-center">
                    <Link href={`/group/${group?.id}/home`} className="bg-sky-600 text-center text-white rounded-3xl md:text-xl text-base md:py-3 py-2 w-2/3">
                        グループページへ進む
                    </Link>
                </div>
            </div>
        </div>
    )
}