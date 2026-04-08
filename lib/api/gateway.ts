export async function fetchGatewayNetworkState() {
  try {
    const res = await fetch("https://mainnet.radixdlt.com/state/entity/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addresses: ["consensusmanager_rdx1scxxxxxxxxxxcnsmgrxxxxxxxxx000999665565xxxxxxxxxcnsmgr"]
      })
    });
    
    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch Radix Gateway", err);
    return null;
  }
}
