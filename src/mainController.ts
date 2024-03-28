import {Controller} from "./controller.ts";
import './style.css'
import {el, t} from "./util.ts";
import {Model} from "./model.ts";

export class MainController implements Controller {
    constructor(private readonly model: Model) {
    }

    render() {
        const header = el('h1', {}, t('Smorgasbord'))

        const shareLink = el('div', {id: 'share-link'},)
        const shareButton = this.shareButton(shareLink)

        const result = el('div', {id: 'result'})
        const compareButton = this.compareButton(result)

        const resetButton = this.resetButton()

        const smorgasbordForm = el('form', {id: "smorgasbord-form"})
        const smorgasbordCategoriesContainer = el('section', {id: 'smorgasbord'}, smorgasbordForm)

        for (const category of this.model.categories()) {
            const categoryContainer = document.createElement('section')
            const categoryHeading = document.createElement("h1")
            categoryHeading.innerText = category
            this.model.subjectsByCategory(category).forEach((item) => {
                if (!item) return;
                const sectionContainer = document.createElement('section')
                const sectionHeading = document.createElement("h2")
                sectionHeading.innerText = item.subject

                const descriptionBlock = document.createElement('blockquote')
                descriptionBlock.innerText = item.description

                const saveChanges = (event: Event) => {
                    const target = event.target as HTMLInputElement;
                    if (target !== null) {
                        this.model.subject(target.name, target.value);
                    }
                }
                const labelContainer = document.createElement('p')

                const yesLabel = document.createElement('label')
                const yesOptionInput = document.createElement('input')
                yesOptionInput.type = "radio"
                yesOptionInput.name = item.id
                yesOptionInput.id = item.id + '-yes'
                yesOptionInput.value = "1"
                yesOptionInput.checked = this.model.subject(item.id) === "1"
                yesOptionInput.addEventListener("change", saveChanges)
                yesLabel.append(yesOptionInput, document.createTextNode(' Yes'))

                const maybeLabel = document.createElement('label')
                const maybeOptionInput = document.createElement('input')
                maybeOptionInput.type = "radio"
                maybeOptionInput.name = item.id
                maybeOptionInput.id = item.id + '-maybe'
                maybeOptionInput.value = "2"
                maybeOptionInput.checked = this.model.subject(item.id) === "2"
                maybeOptionInput.addEventListener("change", saveChanges)
                maybeLabel.append(maybeOptionInput, document.createTextNode(` Maybe, Let's Talk`))

                const noLabel = document.createElement('label')
                const noOptionInput = document.createElement('input')
                noOptionInput.type = "radio"
                noOptionInput.name = item.id
                noOptionInput.id = item.id + '-no'
                noOptionInput.value = "3"
                noOptionInput.checked = this.model.subject(item.id) === "3"
                noOptionInput.addEventListener("change", saveChanges)
                noLabel.append(noOptionInput, document.createTextNode(' No'))

                labelContainer.append(yesLabel, maybeLabel, noLabel)


                sectionContainer.append(sectionHeading, descriptionBlock, labelContainer)
                categoryContainer.append(sectionContainer)
            })
            smorgasbordForm.append(categoryContainer)
        }

        const footer = el('footer', {}, t('Made with ❤ by '), el('a', {href: 'https://barcelona-polyamory.com'}, t('Barcelona Poly People')))

        return el('section', {}, header, shareButton, compareButton, resetButton, shareLink, result, smorgasbordCategoriesContainer, footer);
    }

    shareButton(shareLink: HTMLElement) {
        const shareButton = document.createElement('button')
        shareButton.innerText = 'Share yours'
        shareButton.addEventListener("click", () => {
            const values = this.model.subjects
            const shareString = Object.entries(values).map(x => x.join("")).join("")
            if (shareString.length === 0) {
                alert("Please answer questions first.")
                return;
            }
            shareLink.innerText = `${document.location.origin}${document.location.pathname}?share=${shareString}&time=${new Date().getTime()}`;
            shareLink.style.display = "block";
        })
        return shareButton
    }

    resetButton() {
        const resetButton = document.createElement('button')
        resetButton.innerText = 'Reset'
        resetButton.addEventListener("click", () => {
            window.localStorage.clear()
            window.location.href = window.location.origin + window.location.pathname;
        })
        return resetButton
    }

    compareButton(result: HTMLElement) {
        const compareButton = document.createElement('button')
        compareButton.innerText = 'Compare results'
        compareButton.addEventListener("click", () => {
            if (Object.keys(this.model.sharedSubjects).length === 0) {
                alert("You can only compare your results to what others have sent you.")
            }

            if (result.style.display === "block") {
                result.style.display = "none";
                return;
            }

            const rowColor = (yours: string, theirs: string) => {
                if (yours === "yes" && theirs === "yes") {
                    return 'full-match'
                }

                if (`${yours}${theirs}`.match(/(yesmaybe|maybeyes|maybemaybe)/)) {
                    return 'partial-match'
                }

                return ''
            }
            const tbody = el('tbody')
            const table = el('table', {id:'compare-table'},
                el('thead', {},
                    el('tr', {},
                        el('th', {}, t('Category')),
                        el('th', {}, t('Subject')),
                        el('th', {}, t('You')),
                        el('th', {}, t('Them')),
                        )
                ), tbody
            )
            const sharedContent = this.model.sharedSubjects
            for (const category of this.model.categories()) {
                for (const item of this.model.subjectsByCategory(category)) {
                    if (!item) {
                        continue
                    }
                    const yours = this.model.values[this.model.subject(item.id) ?? ""]
                    const theirs = this.model.values[sharedContent[item.id]]
                    const row = el('tr', {class: rowColor(yours, theirs)},
                        el('td', {}, t(category)),
                        el('td', {}, t(item.subject)),
                        el('td', {}, t(yours ?? "n/a")),
                        el('td', {}, t(theirs ?? "n/a")),
                    )
                    tbody.append(row)
                }
            }
            result.append(table)
            result.style.display = "block";
        })

        return compareButton
    }
}