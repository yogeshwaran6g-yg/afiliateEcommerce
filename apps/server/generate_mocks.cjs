/**
 * Referral Mock Data Generator
 * 
 * Generates referral data in 3 formats: JSON, Formatted Table (txt), and Hierarchical Tree (txt).
 * Uses cli-table3 and treeify for the formatted outputs.
 */

const fs = require('fs');
const Table = require('cli-table3');
const treeify = require('treeify');

const levels = 6;
const membersPerLevel = 5;
const earningsPerLevel = [100, 80, 60, 40, 20, 10]; // Total for all 5 members in each level
const amountPerMember = [20, 16, 12, 8, 4, 2]; // Amount each member contributes

// Initialize data structure
const data = {
  success: true,
  message: "Referral overview fetched successfully",
  data: {
    totalLevels: levels,
    overallCount: levels * membersPerLevel,
    overallEarnings: earningsPerLevel.reduce((a, b) => a + b, 0),
    levels: []
  }
};

const names = [
    "John Doe", "Jane Smith", "Bob Wilson", "Mary Johnson", "Alice Brown",
    "Tom Harris", "Charlie Davis", "Lucy Miller", "Eve Evans", "Rick Sanchez",
    "Frank Foster", "Sarah Connor", "David Miller", "Emma Wilson", "James Brown",
    "Olivia Taylor", "William Jones", "Sophia Garcia", "Michael Smith", "Isabella Martinez",
    "Alexander Lopez", "Mia Gonzalez", "Ethan Rodriguez", "Charlotte Wilson", "Benjamin Anderson",
    "Amelia Thomas", "Lucas Taylor", "Harper Moore", "Mason Jackson", "Evelyn White"
];

const startTime = new Date("2026-02-07T10:00:00Z");

// 1. Generate core JSON data
for (let i = 1; i <= levels; i++) {
  const levelMembers = [];
  for (let j = 0; j < membersPerLevel; j++) {
    const memberIndex = (i - 1) * membersPerLevel + j;
    const joinedAt = new Date(startTime.getTime() + memberIndex * 3600 * 1000).toISOString();
    levelMembers.push({
      id: 2000 + memberIndex + 1,
      name: names[memberIndex],
      email: names[memberIndex].toLowerCase().replace(/ /g, '.') + "@example.com",
      joinedAt: joinedAt,
      totalAmount: amountPerMember[i-1]
    });
  }
  data.data.levels.push({
    level: i,
    referralCount: membersPerLevel,
    totalEarnings: earningsPerLevel[i-1],
    members: levelMembers
  });
}

// 2. Output JSON File
fs.writeFileSync('expectedData.json', JSON.stringify(data, null, 2));
console.log('✓ Created expectedData.json');

// 3. Generate Formatted Table (.txt)
const table = new Table({
    head: ['Lvl', 'ID', 'Name', 'Email', 'Joined At', 'Earnings'],
    colWidths: [5, 6, 20, 30, 25, 10]
});

data.data.levels.forEach(lvl => {
    lvl.members.forEach(m => {
        table.push([
            lvl.level,
            m.id,
            m.name,
            m.email,
            m.joinedAt.substring(0, 19).replace('T', ' '),
            m.totalAmount.toFixed(2)
        ]);
    });
});

const tableOutput = `REFERRAL OVERALL VIEW\nTotal Count: ${data.data.overallCount}\nTotal Earnings: ${data.data.overallEarnings.toFixed(2)}\n\n${table.toString()}`;
fs.writeFileSync('referral_table.txt', tableOutput);
console.log('✓ Created referral_table.txt');

// 4. Generate Hierarchical Tree (.txt)
// Transform flat data into tree structure for treeify
const treeData = { "Root User (Admin)": {} };
let currentRoot = treeData["Root User (Admin)"];

// For visualization, we'll build a chain based on the first member of each level
for (let i = 0; i < levels; i++) {
    const levelMembers = data.data.levels[i].members;
    const label = `Level ${i+1} (${levelMembers.length} members)`;
    currentRoot[label] = {};
    
    levelMembers.forEach(m => {
        currentRoot[label][`${m.name} [ID: ${m.id}]`] = `Joined: ${m.joinedAt.substring(0, 10)}`;
    });
    
    // Move "chain depth" root to the first member's branch for the next level's children
    const chainLabel = `Branch: ${levelMembers[0].name}'s Team`;
    currentRoot[label][chainLabel] = {};
    currentRoot = currentRoot[label][chainLabel];
}

const treeOutput = "REFERRAL HIERARCHY TREE\n\n" + treeify.asTree(treeData, true);
fs.writeFileSync('referral_tree.txt', treeOutput);
console.log('✓ Created referral_tree.txt');
