export declare class ULine extends String {
  is_uline:boolean;
  toString():string;
}

export declare let html: (template: TemplateStringsArray, ...values: any ) => ULine;
export declare let svg: (template: TemplateStringsArray, ...values: any ) => ULine;
export declare let raw: (template: TemplateStringsArray, ...values: any ) => ULine;
export declare let css: (template: TemplateStringsArray, ...values: any ) => ULine;
