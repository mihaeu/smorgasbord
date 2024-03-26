import {v1} from "./v1.ts";


export class Model {
    private readonly data: {[key: string]: {id: string, subject: string, description: string}[]};
    public readonly values: {[key: string]: string} = {
        "1": "yes",
        "2": "maybe",
        "3": "no",
    }
    public readonly subjects: {[key: string]: string} = {}
    public readonly sharedSubjects: {[key: string]: string} = {}

    constructor(shareString?: string|null) {
        this.data = v1
        const stored = window.localStorage.getItem('data')
        if (stored) {
            this.subjects = JSON.parse(stored)
        }
        if (shareString && shareString.length > 0) {
            for (let i = 0; i <= shareString.length; i += 3) {
                const key = shareString.substring(i, i + 2)
                if (key.length > 0) {
                    this.sharedSubjects[key] = shareString.substring(i + 2, i + 3);
                }
            }
        }
    }

    categories() {
        return Object.keys(this.data)
    }

    subject(key: string, value?: string) {
        if (value) {
            this.subjects[key] = value
            window.localStorage.setItem('data', JSON.stringify(this.subjects))
        } else {
            return this.subjects[key]
        }
    }

    subjectsByCategory(category: string) {
        return this.data[category]
    }
}