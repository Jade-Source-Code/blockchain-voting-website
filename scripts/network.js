const contractABI = YOUR_CONTRACT_ABI;
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const votingContract = new web3.eth.Contract(contractABI, contractAddress);

if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum);
    try {
        await window.ethereum.enable();
    } catch (error) {
        console.error("User denied account access");
    }
} else {
    console.log('No Ethereum provider detected. Install MetaMask.');
}

async function displayVoteCounts(candidateAddresses) {
    const resultsTable = document.getElementById('resultsTable');
    resultsTable.innerHTML = '';

    for (const address of candidateAddresses) {
        try {
            const votes = await votingContract.methods.getVotes(address).call();
            const row = resultsTable.insertRow();
            const cellAddress = row.insertCell(0);
            const cellVotes = row.insertCell(1);
            cellAddress.textContent = address;
            cellVotes.textContent = votes;
        } catch (error) {
            console.error(`Error fetching votes for ${address}:`, error);
        }
    }
}

votingContract.events.VoteCast({
    filter: {}, // You can filter specific events if needed
    fromBlock: 'latest'
})
.on('data', async function(event) {
    console.log('Vote cast event:', event);
    // Optionally, refresh the vote counts
    await displayVoteCounts(candidateAddresses);
})
.on('error', console.error);

window.onload = async () => {
    const candidateAddresses = ['0xCandidateAddress1', '0xCandidateAddress2']; // Replace with actual candidate addresses
    await displayVoteCounts(candidateAddresses);
};
