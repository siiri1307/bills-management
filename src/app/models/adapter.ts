export interface Adapter<T> {
    
    fromJsonToModel(item: any): T;

    fromModelToJson(item: T): JSON;
}