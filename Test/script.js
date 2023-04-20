const sidebar = document.getElementById('sidebar');

// Replace this array with data fetched from your server or API.
const agents = [
    { id: 1, name: '127.0.0.1' },
    { id: 2, name: 'Santiago' },
    { id: 3, name: 'John' },
    { id: 4, name: 'Lukas' },
    { id: 5, name: 'Brad' },
    { id: 6, name: 'Agent 6' },
];

agents.forEach(agent => {
    const button = document.createElement('button');
    const icon = document.createElement('i');
    icon.className = 'fa fa-desktop'; // Font Awesome chat bubble icon
    button.appendChild(icon); // Add icon to button
    const textNode = document.createTextNode(' ' + agent.name); // Add a space before the agent's name for proper spacing
    button.appendChild(textNode);
    button.addEventListener('click', () => {
        // Handle button click here (e.g., open agent chat or profile).
    });
    sidebar.appendChild(button);
});
