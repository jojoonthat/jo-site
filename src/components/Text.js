const target = document.querySelector('#typing');
const newlineSignal = 'α';
const githubSignal = 'Γ';
const linkedinSignal = 'π'
const emailSignal = 'Σ';
const content = `Hey, I'm Joanne.${newlineSignal}
Welcome to my website :)${newlineSignal}
Here's where you can find me:${newlineSignal}
${newlineSignal}
${githubSignal} ${newlineSignal}
${linkedinSignal} ${newlineSignal}
${emailSignal} ${newlineSignal}
${newlineSignal}
Thanks for visiting ~
`
var i = 0;
const type = () => {
    setTimeout(() => {
        // logic starts
        const char = content.charAt(i);
        var toInsert;
        if (char === newlineSignal) {
            toInsert = '<br>';
        } else if (char === githubSignal) {
            toInsert = '<a href="https://github.com/jojoonthat" target="_blank">GitHub</a>';
        } else if (char === linkedinSignal) {
            toInsert = '<a href="https://www.linkedin.com/in/panjoanne/" target="_blank">LinkedIn</a>';
        } else if (char === emailSignal) {
            toInsert = '<a href="mailto:jpan0917@gmail.com" target="_blank">jpan0917@gmail.com</a>';
        } else {
            toInsert = char;
        }
        target.insertAdjacentHTML('beforeend', toInsert);

        // logic ends
        i++;
        if (i < content.length) {
            type();
        }
    }, 30)
}

setTimeout(() => {
    type()
}, 1000);