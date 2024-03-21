import './style.css'
import {v1} from "./v1.ts";

const sharedValues = new URLSearchParams(window.location.search).get("share") ?? ""
let sharedContent = {}
for (let i = 0; i <= sharedValues.length; i += 3) {
    sharedContent[sharedValues.substring(i, i + 2)] = sharedValues.substring(i + 2, i + 3)
}
delete sharedContent[""]

document.getElementById('share')<HTMLButtonElement>.addEventListener("click", () => {
    const values = Object.fromEntries(new FormData(window["smorgasbord-form"]))
    const shareString = Object.entries(values).map(x => x.join("")).join("")
    if (shareString.length === 0) {
        alert("Please answer questions first.")
        return;
    }
    const name = (document.getElementById("name") as HTMLInputElement).value
    window["share-link"].innerText = `${document.location.origin}${document.location.pathname}?share=${shareString}${name === "" ? "" : `&name=${encodeURIComponent(name)}`}&time=${new Date().getTime()}`;
    window["share-link"].style.display = "block";
})

document.getElementById('reset')<HTMLButtonElement>.addEventListener("click", () => {
    window.localStorage.clear()
    window.location.href = window.location.origin + window.location.pathname;
})

const data = v1
if (Object.keys(sharedContent).length > 0) {
    for (const category of Object.keys(data)) {
        for (let i = 0; i < data[category].length; ++i) {
            if (!sharedContent[data[category][i].id]) {
                delete data[category][i]
            }
        }
        if (Object.keys(data[category]).length === 0) {
            delete data[category]
        }
    }
}

const values = {
    1: "yes",
    2: "maybe",
    3: "no",
}

// const values = {
//     1: "yes",
//     2: "maybe",
//     3: "maybe-future",
//     4: "talk",
//     5: "definitely-no",
// }

const name = window.localStorage.getItem("name");
const nameTextInput = document.getElementById("name") as HTMLInputElement;
if (name && name.length > 0) {
    nameTextInput.value = name
}

const shareString = window.localStorage.getItem("share");
const savedValues = {}
if (shareString && shareString.length > 0) {
    for (let i = 0; i <= shareString.length; i += 3) {
        const key = shareString.substring(i, i + 2)
        savedValues[key] = shareString.substring(i + 2, i + 3)
    }
}

let content = []
for (const category of Object.keys(data)) {
    content.push(`<h1>${category}</h1>`)
    for (const item of data[category]) {
        if (!item) continue;
        content.push(`<section>
    <h2>${item.subject}</h2>
    <blockquote>${item.description}</blockquote>
    <p>
        <label for="${item.id}-yes"><input type="radio" name="${item.id}" id="${item.id}-yes" value="1" ${savedValues[item.id] === "1" && `checked`}/> Yes</label>
        <label for="${item.id}-maybe"><input type="radio" name="${item.id}" id="${item.id}-maybe" value="2" ${savedValues[item.id] === "2" && `checked`}/> Maybe, Let's Talk</label>
        <label for="${item.id}-no"><input type="radio" name="${item.id}" id="${item.id}-no" value="3" ${savedValues[item.id] === "3" && `checked`}/> No</label>
    </p>
</section>`)
    }
}
document.getElementById<HTMLDivElement>('smorgasbord').innerHTML = content.join("");

setTimeout(() => {
    [...document.querySelectorAll('input')].forEach(element => element.addEventListener("change", () => {
        const values = Object.fromEntries(new FormData(window["smorgasbord-form"]))
        const shareString = Object.entries(values).map(x => x.join("")).join("")
        window.localStorage.setItem("share", shareString)
        window.localStorage.setItem("name", nameTextInput.value)
    }))
}, 100)

document.getElementById<HTMLButtonElement>('compare').addEventListener("click", () => {
    if (Object.keys(sharedContent).length === 0) {
        alert("You can only compare your results to what others have sent you.")
    }

    if (window['result'].style.display === "block") {
        window['result'].style.display = "none";
        return;
    }

    const shareString = window.localStorage.getItem("share");
    const filledInContent = {}
    if (shareString && shareString.length > 0) {
        for (let i = 0; i <= shareString.length; i += 3) {
            const key = shareString.substring(i, i + 2)
            filledInContent[key] = shareString.substring(i + 2, i + 3);
        }
    }
    delete filledInContent[""]

    console.log(sharedContent);
    console.log(filledInContent);
    if (Object.keys(sharedContent).join() !== Object.keys(filledInContent).join()) {
        alert("Fill in all the subjects which where shared with you.")
        return
    }

    const rowColor = (yours, theirs) => {
        if (yours === "yes" && theirs === "yes") {
            return 'limegreen'
        }

        if (`${yours}${theirs}`.match(/(yesmaybe|maybeyes|maybemaybe)/)) {
            return 'yellow'
        }

        return 'inherit'
    }
    let content = [`<table>
    <thead>
    <tr>
        <th>Category</th>
        <th>Subject</th>
        <th>You</th>
        <th>Them</th>
    </tr>
</thead><tbody>`]
    for (const category of Object.keys(data)) {
        for (const item of data[category]) {
            if (!item) {
                continue
            }
            content.push(`<tr style="background-color:${rowColor(values[sharedContent[item.id]], values[filledInContent[item.id]])};">
    <td>${category}</td>
    <td>${item.subject}</td>
    <td>${values[sharedContent[item.id]]}</td>
    <td>${values[filledInContent[item.id]]}</td>
</tr>`)
        }
    }
    content.push(`</tbody></table>`)
    window['result'].innerHTML = content.join("\n")
    window['result'].style.display = "block";
})
