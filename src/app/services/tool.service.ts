import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class ToolService {

    toolsSubject = new Subject<any[]>();
    tools = [
        {
            id: 1,
            type: 'Pieuvre'
        },

        {
            id: 2,
            type: 'Webcam'
        },

        {
            id: 3,
            type: 'Tableau'
        },

        {
            id: 4,
            type: 'Ecran'
        }
    ];

    constructor(private httpClient: HttpClient) { }

    emitToolSubject() {
        this.toolsSubject.next(this.tools.slice());
    }

    getToolById(id: number) {
        const tool = this.tools.find(
            (toolObject) => {
                return toolObject.id === id;
            }
        );
        return tool;
    }

    addTool(type: string) {
        const toolObject = {
            id: 0,
            type: ''
        };
        toolObject.type = type;
        toolObject.id =
            this.tools[this.tools.length - 1].id + 1;

        this.tools.push(toolObject);
        this.emitToolSubject();
    }
}