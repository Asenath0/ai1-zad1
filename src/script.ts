const stylePaths: string[] = [
    "/public/style-1.css",
    "/public/style-2.css",
    "/public/style-3.css",
]

const addStyle = (path: string): void => {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = path;
    document.head.appendChild(linkElement);
}

const renderStyleButtons = (): void => {

    const changeStyle = (index: number): void => {
        const existingLinks: NodeListOf<HTMLLinkElement> = document.querySelectorAll("link[rel='stylesheet']");
        existingLinks.forEach((link: HTMLLinkElement) => link.remove());
        addStyle(stylePaths[index]);
    }
    const aside: HTMLElement = document.createElement("aside");
    
    for (let i = 0; i < stylePaths.length; i++) {
        const button: HTMLButtonElement = document.createElement("button");
        button.textContent = `style ${i + 1}`;
        button.onclick = () => changeStyle(i);
        aside.appendChild(button);
    }
    
    document.body.insertBefore(aside, document.body.firstChild);
}

addStyle(stylePaths[0]);
renderStyleButtons();
