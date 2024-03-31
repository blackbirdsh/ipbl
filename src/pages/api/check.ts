// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";
import fs from "fs";

type Data = {
  ip: string;
  tier: string;
  description: string;
};

const checkBlacklists = (ip: string) => {
  const free_proxies = fs
    .readFileSync("./blacklist/free-proxies.txt", "utf-8")
    .split("\n");

  const proxies = fs
    .readFileSync("./blacklist/proxies.txt", "utf-8")
    .split("\n");

  const vpns = fs.readFileSync("./blacklist/vpns.txt", "utf-8").split("\n");

  if (free_proxies.includes(ip)) {
    return { ip, tier: "FREE PROXY", description: "This IP is a free proxy" };
  }

  if (proxies.includes(ip)) {
    return { ip, tier: "PROXY", description: "This IP is a proxy" };
  }

  if (vpns.includes(ip)) {
    return { ip, tier: "VPN", description: "This IP is a VPN" };
  }

  return {
    ip,
    tier: "CLEAN",
    description: "We have nothing against this IP",
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const ip = req.query.ip;
  const detectedIp = requestIp.getClientIp(req)?.split(":").pop() as string;

  console.log(`Checking IP: ${ip || detectedIp}`);

  if (!ip) {
    return res.status(200).json(checkBlacklists(detectedIp));
  }

  return res.status(200).json(checkBlacklists(ip as string));
}
