import Image from "next/image";
import React from "react";

export default function Home() {
  const [ip, setIp] = React.useState<string | null>(null);
  const [checkedIp, setCheckedIp] = React.useState<string | null>(null);
  const [tier, setTier] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState<string | null>(null);

  const checkIp = async (ip: string) => {
    const res = await fetch(
      `https://blackbirdapi.stonechat.me/ipbl/check?ip=${ip}`
    );
    const data = await res.json();

    setCheckedIp(data.ip);
    setTier(data.class);
    setDescription(data.description);
  };

  React.useEffect(() => {
    const fetchIp = async () => {
      const res = await fetch("/api/get-ip");
      const data = await res.json();

      checkIp(data.ip);
    };
    fetchIp();
  }, []);

  return (
    <main className="flex flex-col gap-12 justify-center items-center p-4 sm:p-8">
      <nav className="w-full">
        <div className="flex items-center gap-4">
          <Image src="/logo.svg" alt="Blackbird Logo" width={32} height={32} />
          <div className="font-black text-2xl">BLACKBIRD</div>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-4xl font-black">IP BLACKLIST</h1>
        <section className="flex flex-col gap-8 p-4 bg-secondary rounded-md w-96 max-w-full">
          <div className="flex flex-col gap-2">
            <input
              value={ip || ""}
              onChange={(e) => setIp(e.target.value)}
              type="text"
              placeholder="Enter an IP address"
              className="bg-black p-2 px-4 rounded-md outline-none"
            />
            <button
              className="bg-white text-black font-black p-2 px-4 rounded-md hover:bg-opacity-75 duration-200"
              onClick={() => {
                checkIp(ip || "");
              }}
            >
              CHECK
            </button>
          </div>

          <div className="relative flex flex-col items-center justify-center p-2 w-full h-40 bg-black rounded-md">
            <div className="text-xs opacity-50 absolute top-2 left-2">
              {checkedIp}
            </div>

            <div className="text-2xl font-black text-center">{tier}</div>
            <div className="text-sm font-light text-center opacity-50">
              {description}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
