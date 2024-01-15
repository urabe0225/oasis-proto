'use client'
import { DateTime } from 'luxon';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];
const MAX_DATA_COUNT = 6000;

//サンプルデータ生成
const now = DateTime.local();
const lastDay = now.minus({ day: 1 })
const lastMonth = now.minus({ month: 1 })
const lastYear = now.minus({ year: 1 })

interface MyObject {
  timestamp: any;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
}

let next = now;
let sampleData = [...Array(MAX_DATA_COUNT)].map((_, i) => {
    next = next.minus({ hour: Math.floor(Math.random()*3 )})
    return {
      timestamp: next,
      q1: Math.round(Math.random()),
      q2: Math.round(Math.random()),
      q3: Math.round(Math.random()),
      q4: Math.round(Math.random()),
      q5: Math.round(Math.random()),
      q6: Math.round(Math.random()),
    };
  }).reverse();

const oneYear = sampleData.filter(
  item => item.timestamp.equals(DateTime.max(lastYear,item.timestamp))
).map((obj) => ({
  ...obj,
  timestamp: Number(obj.timestamp.toFormat('MM')),
}));
const oneMonth = sampleData.filter(
  item => item.timestamp.equals(DateTime.max(lastMonth,item.timestamp))
).map((obj) => ({
  ...obj,
  timestamp: Number(obj.timestamp.toFormat('dd')),
}));

const oneDay = sampleData.filter(
  item => item.timestamp.equals(DateTime.max(lastDay,item.timestamp))
).map((obj) => ({
  ...obj,
  timestamp: Number(obj.timestamp.toFormat('HH')),
}));

function mergeWithTime(objects: MyObject[], start: number, end: number, currentTime: number): MyObject[] {
  const sortedObjects = objects.sort((a, b) => a.timestamp - b.timestamp);
  const result: MyObject[] = [];

  for (let timestamp = start; timestamp <= end; timestamp++) {
    const matchingObjects = sortedObjects.filter(obj => obj.timestamp === timestamp);
    if (matchingObjects.length > 0) {
      const totalQ1 = matchingObjects.reduce((acc, obj) => acc + obj.q1, 0);
      result.push({ 
        timestamp, 
        q1: matchingObjects.reduce((acc, obj) => acc + obj.q1, 0),
        q2: matchingObjects.reduce((acc, obj) => acc + obj.q2, 0),
        q3: matchingObjects.reduce((acc, obj) => acc + obj.q3, 0),
        q4: matchingObjects.reduce((acc, obj) => acc + obj.q4, 0),
        q5: matchingObjects.reduce((acc, obj) => acc + obj.q5, 0),
        q6: matchingObjects.reduce((acc, obj) => acc + obj.q6, 0),
      });
    } else {
      result.push({ 
        timestamp, 
        q1: 0,
        q2: 0,
        q3: 0,
        q4: 0,
        q5: 0,
        q6: 0,
      });
    }
  }
  const currentIndex = result.findIndex(obj => obj.timestamp === currentTime);
  if (currentIndex !== -1) {
    result.unshift(...result.splice(currentIndex, result.length - currentIndex));
  }

  return result;
}
const oneDay2 = mergeWithTime(oneDay, 0, 23, now.hour);
const oneMonth2 = mergeWithTime(oneMonth, 1, 31, now.day);
const oneYear2 = mergeWithTime(oneYear, 1, 12, now.month);

//console.log('現在', now.toFormat('y/MM/dd HH:mm:ss'))
//console.log('一日前', lastDay.toFormat('y/MM/dd HH:mm:ss'))
//console.log('一ヶ月前', lastMonth.toFormat('y/MM/dd HH:mm:ss'))
//console.log('一年前', lastYear.toFormat('y/MM/dd HH:mm:ss'))
console.log("整形前", oneDay.filter(item => item.timestamp))
console.log("整形後", oneDay2.filter(item => item.timestamp))

// 積立棒グラフ
const BPlot = (props: any) => {
  return (
    <>
    <h3 className="text-white text-center">{props.title}</h3>
    <ResponsiveContainer width="100%" height="100%" >
      <BarChart width={730} height={250} data={props.plotdata}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip/>
        <Bar dataKey="q1" stackId="a" fill={COLORS[0]} />
        <Bar dataKey="q2" stackId="a" fill={COLORS[1]} />
        <Bar dataKey="q3" stackId="a" fill={COLORS[2]} />
        <Bar dataKey="q4" stackId="a" fill={COLORS[3]} />
        <Bar dataKey="q5" stackId="a" fill={COLORS[4]} />
        <Bar dataKey="q6" stackId="a" fill={COLORS[5]} />
      </BarChart>
    </ResponsiveContainer>
    </>
  )
}

export default function Home() {
  return (
    <main className="flex flex-col lg:flex-row min-h-screen">
      {/* Container 1 */}
      <div className="w-full h-96 lg:w-1/2 xl:w-1/2 p-4 lg:p-8 bg-gray-200">
        <h1 className="text-2xl font-bold">Container 1</h1>
          <div className="h-[300px] bg-gray-700 rounded">
          <BPlot plotdata={oneDay2} title="Day"/>
          </div>
      </div>
      {/* Container 2 */}
      <div className="w-full h-96 lg:w-1/2 xl:w-1/2 p-4 lg:p-8 bg-gray-300">
        <h1 className="text-2xl font-bold">Container 2</h1>
          <div className="h-[300px] bg-gray-700 rounded">
            <BPlot plotdata={oneMonth2} title="Month"/>
          </div>
      </div>
      {/* Container 3 */}
      <div className="w-full h-96 lg:w-1/2 xl:w-1/2 p-4 lg:p-8 bg-gray-300">
        <h1 className="text-2xl font-bold">Container 3</h1>
          <div className="h-[300px] bg-gray-700 rounded">
            <BPlot plotdata={oneYear2} title="Year"/>
          </div>
      </div>
    </main>
  );
};