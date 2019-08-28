export async function loadJsonData(src) {
    const req = await window.fetch(src);
    const json = await req.json();
    return json;
}