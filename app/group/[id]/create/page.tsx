import { createClient } from "@/utils/supabase/server";
import PaymentForm from "./PaymentForm";

interface Member {
    id: string;
    name: string;
}

interface PageProps {
    params: Promise<{id: string}>;
}

export default async function CreatePayment({ params }: PageProps) {
    const { id: groupId } = await params;
    const supabase = await createClient();

    // groupテーブルからメンバーリストを取得
    const { data: groupData, error } = await supabase.from('groups').select('members').eq('id', groupId).single();

    if (error || !groupData) {
        console.error('グループメンバーの取得エラー：', error);
    }

    const members: Member[] = groupData?.members || [];

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="lg:w-1/2 md:w-2/3 w-full m-auto px-5 md:px-0 pt-10">
                <PaymentForm members={members} groupId={groupId}/>
            </div>
        </div>
    )
}