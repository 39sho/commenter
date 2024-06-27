import { Viewer } from "../lib/main";
import testData from "./test.json";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<canvas height="2160" width="4096" style="width: 100%;"></canvas>
`;

const viewer = new Viewer(document.querySelector("canvas")!);

viewer.start();

let i = 0;

const test = () => {
    const data = testData[i] as [number, string];
    data[0] += Math.random(); // 秒が記録されてないので適当に
    viewer.addMessage(data[1]);
    i++;
    if (i >= testData.length) i = 0;
    // setTimeout(test, data[0] * 1000 * 60);
    setTimeout(test, data[0] * 1000);
    console.log(data);
};

setTimeout(test);
