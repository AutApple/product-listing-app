export function toOutputDto<Entity, OutputDto>(
    data: Entity | Entity[], 
    dtoConstructor: new (entity: Entity, ...args: any[]) => OutputDto
): OutputDto | OutputDto[] {
    return Array.isArray(data) ? data.map(e => new dtoConstructor(e)) :  new dtoConstructor(data);
}