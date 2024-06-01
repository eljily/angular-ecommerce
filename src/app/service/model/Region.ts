export interface Region {
    id: number;
    name: string;
    subRegions: SubRegion[]; 
}

export interface SubRegion {
    id: number;
    name: string;
}
