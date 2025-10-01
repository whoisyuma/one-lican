import CreateGroup from './CreateGroup'

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="w-1/2 m-auto pt-10">
        <h1 className='font-semibold text-lg mb-10'>新しいグループの作成</h1>
        <CreateGroup/>
      </div>
    </div>
  );
}
