import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const score = Math.max(0, Math.min(100, Number(searchParams.get('score')) || 0));
  const status = (searchParams.get('status') || 'CRITICAL RISK').slice(0, 40);

  return new ImageResponse(
    <div style={{
      width:'1200px',height:'630px',display:'flex',flexDirection:'column',
      background:'#05070b',color:'#edf5f2',padding:'64px 72px',
      fontFamily:'Arial, sans-serif',position:'relative',overflow:'hidden'
    }}>
      <div style={{position:'absolute',inset:0,opacity:.22,backgroundImage:'linear-gradient(rgba(120,150,160,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(120,150,160,.12) 1px,transparent 1px)',backgroundSize:'48px 48px'}} />
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',zIndex:1,fontSize:20,letterSpacing:3,color:'#75858a'}}>
        <div>RANCORDER.DEV</div><div>PoC SURVIVAL TEST</div>
      </div>
      <div style={{display:'flex',flex:1,alignItems:'center',justifyContent:'space-between',zIndex:1}}>
        <div style={{display:'flex',flexDirection:'column'}}>
          <div style={{fontSize:24,letterSpacing:4,color:'#a78bfa',marginBottom:24}}>PRODUCTION READINESS</div>
          <div style={{fontSize:76,fontWeight:800,lineHeight:.95,letterSpacing:-4}}>そのPoC、<br/>本番で生き残れるか。</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end'}}>
          <div style={{display:'flex',alignItems:'flex-end'}}>
            <div style={{fontSize:180,fontWeight:800,lineHeight:.75,letterSpacing:-12}}>{score}</div>
            <div style={{fontSize:42,color:'#5df2a5',marginLeft:10}}>%</div>
          </div>
          <div style={{fontSize:24,letterSpacing:3,color:score>=85?'#5df2a5':score>=65?'#f0c65b':'#ff5f6d',marginTop:28}}>{status}</div>
        </div>
      </div>
      <div style={{height:5,background:'#172026',zIndex:1}}>
        <div style={{width:`${score}%`,height:'100%',background:'linear-gradient(90deg,#ff5f6d,#f0c65b,#5df2a5)'}} />
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
