import { Transform } from 'class-transformer';

// This transformer is used to decompose queries like key=value1,value2,value3  into array of separate strings 
export function ToArray() {
    return Transform(({ value }) => {
        if (value === undefined || value === null) return []; // return empty array if its null
        if (Array.isArray(value)) return value; // return value itself if its already array
        return String(value).split(',').map((v) => v.trim()); // finally convert comma-separated values into array and trim em
    })
}