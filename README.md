# 割り勘アプリ
> You can find the English version of this README below.
> この README の英語版は下の方にあります。

## プロジェクト概要

本プロジェクトでは、グループでの食事や旅行にかかった費用を簡単に記録し、メンバー間の精算を表示するためのシンプルな割り勘Webアプリケーションです。Next.jsの機能である**Server Action**と**Supabase(PostgreSQL)**の組み合わせにより、高速で安全なフルスタックアプリケーションを実現しています。

## 使用技術

- **フレームワーク：** Next.js(App Router)
- **言語：** Typescript
- **データベース:** Supabase
- **スタイル：** Tailwind CSS / CSS

## 主な機能

- グループ作成：グループ名とメンバー名を自由に入力し、新しい割り勘グループを作成します。
- グループ詳細表示：グループのIDに基づいて、メンバーリスト、立替一覧、精算結果を表示します。
- 利用額の表示：精算方法だけでなく、個別の利用額の表示も行います。
- 立て替えの追加：誰が、何の費用を、いくら立て替えたかを記録します。
- 立て替えの編集・削除：一覧から特定の立替を選択し、内容の編集や、立替記録自体の削除が可能です。

## 学んだこと・工夫したこと
- Server Actionsによる責務の分離を徹底しました。
- Supabase CLIを用いてマイグレーションでテーブル構造の管理をしました。
- 1つのページ内で、クライアントコンポーネントとサーバーコンポーネントに分け、データの処理はServer Actionsで行いました。
- 複数のテーブル利用したので管理を工夫しました。
- より良いUI/UXを意識したデザインに気を付けた。

## 追加したい機能
- 多通貨対応：円以外の通貨での建て替えを記録を可能にする。
- ~~利用額の表示：割り勘の精算機能だけでなく、個別の利用額の表示も行う。~~　（実装済み）
- ~~日付の表示：立替一覧内に立替の追加日時を追加。~~（実装済み）
- ~~フォーム送信中の状態管理~~（実装済み）

## 公開サイト
こちらからデプロイ後のサイトをご覧いただけます：
[https://one-lican.vercel.app/](https://one-lican.vercel.app/)

## デザイン

### モバイル版
![モバイル版のデザイン例](/public/mockup1.png)

### デスクトップ版
![デスクトップ版のデザイン例](/public/mockup2.png)

## 連絡先
以下から気軽にご連絡ください：
- E-mail: [whoisyuma.0913@gmail.com](whoisyuma.0913@gmail.com)

## 備考
このアプリは学習用として作成しました。

# Split Bill App

## Project Overview

This project is a simple web application designed to easily record group expenses—such as meals or trips—and display the settlement results between members. It is built as a fast and secure full-stack app using **Server Actions** in Next.js and **Supabase (PostgreSQL)**.

## Technologies Used

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** Supabase
- **Styling:** Tailwind CSS / CSS

## Main Features

- **Create Group:** Enter a group name and member names freely to create a new split-bill group.
- **Group Details View:** Display member lists, expense records, and settlement results based on the group ID.
- **Add Expense:** Record who paid for what and how much.
- **Edit/Delete Expense:** Select specific expenses from the list to edit or delete records.

## Key Learnings & Highlights

- Properly separated responsibilities using Server Actions.
- Managed database schema using Supabase CLI and migrations.
- Combined client and server components within a single page, using Server Actions for data processing.
- Managed multiple tables efficiently in Supabase.
- Focused on designing for better UI/UX.

## Future Improvements

- **Multi-Currency Support:** Allow users to record expenses in currencies other than JPY.
- **Individual Spending Display:** Show each user's total usage in addition to settlement results.
- **Timestamp Display:** Include creation date/time in the expense list.
- **Loading State Management:** Handle UI states during form submissions.

## Live Site

You can try the deployed version of the app here:  
[https://one-lican.vercel.app/](https://one-lican.vercel.app/)

## Design

### Mobile Version  
![Mobile Design Example](/public/mockup1.png)

### Desktop Version  
![Desktop Design Example](/public/mockup2.png)

## Contact

Feel free to reach out via:  
- E-mail: [whoisyuma.0913@gmail.com](mailto:whoisyuma.0913@gmail.com)

## Notes

This app was created for learning purposes.
