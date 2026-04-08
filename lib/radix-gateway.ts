import { NetworkType } from "@/contexts/NetworkContext";

export function getGatewayUrl(network: NetworkType) {
  switch (network) {
    case "Mainnet":
      return "https://mainnet.radixdlt.com";
    case "Testnet":
    case "Stokenet":
      return "https://babylon-stokenet-gateway.radixdlt.com";
    default:
      return "https://mainnet.radixdlt.com";
  }
}

export async function fetchLiveTransactions(network: NetworkType) {
  const baseUrl = getGatewayUrl(network);
  try {
    const res = await fetch(`${baseUrl}/stream/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opt_ins: {
          manifest_instructions: true
        },
        limit_per_page: 5
      })
    });
    
    if (!res.ok) {
      throw new Error(`Gateway returned ${res.status}`);
    }
    
    return await res.json();
  } catch (err) {
    console.error("Live transaction fetch failed:", err);
    return null;
  }
}

// Fetch network status for pulse
export async function fetchNetworkPulse(network: NetworkType) {
  const baseUrl = getGatewayUrl(network);
  try {
    const res = await fetch(`${baseUrl}/state/entity/details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addresses: ["consensusmanager_rdx1scxxxxxxxxxxcnsmgrxxxxxxxxx000999665565xxxxxxxxxcnsmgr"]
      })
    });
    
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}
