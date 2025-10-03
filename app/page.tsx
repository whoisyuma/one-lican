import CreateGroup from './CreateGroup'

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="lg:w-1/2 md:w-2/3 w-full m-auto px-5 md:px-0 pt-10">
        <h1 className='font-semibold text-lg mb-10'>新しいグループの作成</h1>
        <CreateGroup/>
      </div>
    </div>
  );
}
