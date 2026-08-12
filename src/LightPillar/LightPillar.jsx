import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LightPillar.css';

export default function LightPillar({
  topColor = '#5227FF', bottomColor = '#FF9FFC', intensity = 1,
  rotationSpeed = 0.3, interactive = false, className = '',
  glowAmount = 0.005, pillarWidth = 3, pillarHeight = 0.4,
  noiseIntensity = 0.5, mixBlendMode = 'screen', pillarRotation = 0,
  quality = 'high'
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const low = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const iterations = quality === 'low' || low ? 24 : quality === 'medium' ? 40 : 80;
    const renderer = new THREE.WebGLRenderer({ antialias:false, alpha:true, powerPreference: low ? 'low-power' : 'high-performance', depth:false, stencil:false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, low ? 1 : 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    const color = h => { const c = new THREE.Color(h); return new THREE.Vector3(c.r,c.g,c.b); };
    const vertexShader = `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}`;
    const fragmentShader = `precision highp float;
      uniform float uTime,uIntensity,uGlow,uWidth,uHeight,uNoise,uRC,uRS,uPRC,uPRS;
      uniform vec2 uResolution; uniform vec3 uTop,uBottom; varying vec2 vUv;
      const int ITER=${iterations};
      void main(){
        vec2 uv=(vUv*2.0-1.0)*vec2(uResolution.x/uResolution.y,1.0);
        uv=vec2(uPRC*uv.x-uPRS*uv.y,uPRS*uv.x+uPRC*uv.y);
        vec3 ro=vec3(0,0,-10),rd=normalize(vec3(uv,1)); vec3 col=vec3(0); float t=.1;
        for(int i=0;i<ITER;i++){
          vec3 p=ro+rd*t; p.xz=vec2(uRC*p.x-uRS*p.z,uRS*p.x+uRC*p.z);
          vec3 q=p; q.y=p.y*uHeight+uTime; q.xz+=cos(q.zxy-uTime)*0.5;
          float d=length(cos(q.xz))-.2; float bound=length(p.xz)-uWidth; float k=4.; float h=max(k-abs(d-bound),0.);
          d=max(d,bound)+h*h*.0625/k; d=abs(d)*.15+.01;
          float grad=clamp((15.-p.y)/30.,0.,1.); col+=mix(uBottom,uTop,grad)/d; t+=d; if(t>50.)break;
        }
        col=tanh(col*uGlow/(uWidth/3.));
        col-=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)/15.*uNoise;
        gl_FragColor=vec4(col*uIntensity,1.);
      }`;

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, transparent:true, depthWrite:false, depthTest:false,
      uniforms:{uTime:{value:0},uResolution:{value:new THREE.Vector2()},uTop:{value:color(topColor)},uBottom:{value:color(bottomColor)},uIntensity:{value:intensity},uGlow:{value:glowAmount},uWidth:{value:pillarWidth},uHeight:{value:pillarHeight},uNoise:{value:noiseIntensity},uRC:{value:1},uRS:{value:0},uPRC:{value:Math.cos(pillarRotation*Math.PI/180)},uPRS:{value:Math.sin(pillarRotation*Math.PI/180)}}});
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),material));

    const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);material.uniforms.uResolution.value.set(w,h)};
    resize(); window.addEventListener('resize',resize,{passive:true});
    let raf, time=0, last=performance.now();
    const animate=now=>{const dt=now-last;if(dt>=1000/60){time+=.016*rotationSpeed;material.uniforms.uTime.value=time;material.uniforms.uRC.value=Math.cos(time*.3);material.uniforms.uRS.value=Math.sin(time*.3);renderer.render(scene,camera);last=now}raf=requestAnimationFrame(animate)};
    raf=requestAnimationFrame(animate);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);material.dispose();renderer.dispose();renderer.forceContextLoss();if(el.contains(renderer.domElement))el.removeChild(renderer.domElement)};
  }, [topColor,bottomColor,intensity,rotationSpeed,glowAmount,pillarWidth,pillarHeight,noiseIntensity,pillarRotation,quality]);

  return <div ref={ref} className={`light-pillar-container ${className}`} style={{mixBlendMode}} aria-hidden="true" />;
}
