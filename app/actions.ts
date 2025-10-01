'use server'

import { createClient } from "@/utils/supabase/server"
import { v4 as uuidv4 } from 'uuid';

export async function createGroup(formData: FormData) {
    const supabase = await createClient();
    const groupName = formData.get('groupName') as string;

    // メンバー名のバリデーション
    const memberNames = (formData.getAll('memberName') as string[]).filter(name => name.trim() !== '');

    // それぞれのメンバーにユニークなidを付与
    const members = memberNames.map(name => ({ id: uuidv4(), name }));

    try {
        const { data, error } = await supabase.from('groups').insert([{ name: groupName, members: members }]).select();

        if (error) {
            console.error('グループ作成エラー', error);
            return { error: 'グループの作成に失敗しました。'};
        }

        if (!data || data.length === 0) {
            return { error: 'グループ作成後にデータが取得できませんでした。'};
        }

        const newGroupId = data[0].id;
        
        return { success: true, groupId: newGroupId };
    } catch (e) {
        console.error('予期せぬエラー：', e);
        return { error: 'グループの作成中に予期せぬエラーが発生しました。'};
    }
}