import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[url('/map-bg.jpg')] bg-cover bg-center bg-[rgba(0,0,0,0.5)] bg-blend-multiply">
      <div className="text-center max-w-2xl">
        <h1 className="text-8xl font-bold logo-text tracking-wide">
          WORLD
          <br />
          WEAVER
        </h1>
        <p className="mt-2 text-xl text-white font-medium" style={{ textShadow: '1px 1px 2px #000' }}>
          build your world. create your story.
        </p>
        
        <div className="mt-12">
          <Link 
            href="/upload" 
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-12 shadow-lg square-button"
          >
            START
          </Link>
        </div>
      </div>
    </div>
  );
}
