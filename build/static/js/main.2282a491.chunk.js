(this["webpackJsonpjo-site"]=this["webpackJsonpjo-site"]||[]).push([[0],{18:function(t,n,e){"use strict";e.r(n);var i=e(5),o=e.n(i),a=e(11),r=e.n(a),s=e(4),l=e(0),c=e(1),v=e(2),d=function(t){Object(c.a)(e,t);var n=Object(v.a)(e);function e(){Object(l.a)(this,e);var t=e.SkyShader,i=new s.s({name:"SkyShader",fragmentShader:t.fragmentShader,vertexShader:t.vertexShader,uniforms:s.u.clone(t.uniforms),side:s.c,depthWrite:!1});return n.call(this,new s.d(1,1,1),i)}return e}(s.k);d.prototype.isSky=!0,d.SkyShader={uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new s.w},up:{value:new s.w(0,1,0)}},vertexShader:"\n\t\tuniform vec3 sunPosition;\n\t\tuniform float rayleigh;\n\t\tuniform float turbidity;\n\t\tuniform float mieCoefficient;\n\t\tuniform vec3 up;\n\t\tvarying vec3 vWorldPosition;\n\t\tvarying vec3 vSunDirection;\n\t\tvarying float vSunfade;\n\t\tvarying vec3 vBetaR;\n\t\tvarying vec3 vBetaM;\n\t\tvarying float vSunE;\n\t\t// constants for atmospheric scattering\n\t\tconst float e = 2.71828182845904523536028747135266249775724709369995957;\n\t\tconst float pi = 3.141592653589793238462643383279502884197169;\n\t\t// wavelength of used primaries, according to preetham\n\t\tconst vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );\n\t\t// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:\n\t\t// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))\n\t\tconst vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );\n\t\t// mie stuff\n\t\t// K coefficient for the primaries\n\t\tconst float v = 4.0;\n\t\tconst vec3 K = vec3( 0.686, 0.678, 0.666 );\n\t\t// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K\n\t\tconst vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );\n\t\t// earth shadow hack\n\t\t// cutoffAngle = pi / 1.95;\n\t\tconst float cutoffAngle = 1.6110731556870734;\n\t\tconst float steepness = 1.5;\n\t\tconst float EE = 1000.0;\n\t\tfloat sunIntensity( float zenithAngleCos ) {\n\t\t\tzenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );\n\t\t\treturn EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );\n\t\t}\n\t\tvec3 totalMie( float T ) {\n\t\t\tfloat c = ( 0.2 * T ) * 10E-18;\n\t\t\treturn 0.434 * c * MieConst;\n\t\t}\n\t\tvoid main() {\n\t\t\tvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\t\t\tvWorldPosition = worldPosition.xyz;\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\tgl_Position.z = gl_Position.w; // set z to camera.far\n\t\t\tvSunDirection = normalize( sunPosition );\n\t\t\tvSunE = sunIntensity( dot( vSunDirection, up ) );\n\t\t\tvSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );\n\t\t\tfloat rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );\n\t\t\t// extinction (absorbtion + out scattering)\n\t\t\t// rayleigh coefficients\n\t\t\tvBetaR = totalRayleigh * rayleighCoefficient;\n\t\t\t// mie coefficients\n\t\t\tvBetaM = totalMie( turbidity ) * mieCoefficient;\n\t\t}",fragmentShader:"\n\t\tvarying vec3 vWorldPosition;\n\t\tvarying vec3 vSunDirection;\n\t\tvarying float vSunfade;\n\t\tvarying vec3 vBetaR;\n\t\tvarying vec3 vBetaM;\n\t\tvarying float vSunE;\n\t\tuniform float mieDirectionalG;\n\t\tuniform vec3 up;\n\t\tconst vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );\n\t\t// constants for atmospheric scattering\n\t\tconst float pi = 3.141592653589793238462643383279502884197169;\n\t\tconst float n = 1.0003; // refractive index of air\n\t\tconst float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)\n\t\t// optical length at zenith for molecules\n\t\tconst float rayleighZenithLength = 8.4E3;\n\t\tconst float mieZenithLength = 1.25E3;\n\t\t// 66 arc seconds -> degrees, and the cosine of that\n\t\tconst float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;\n\t\t// 3.0 / ( 16.0 * pi )\n\t\tconst float THREE_OVER_SIXTEENPI = 0.05968310365946075;\n\t\t// 1.0 / ( 4.0 * pi )\n\t\tconst float ONE_OVER_FOURPI = 0.07957747154594767;\n\t\tfloat rayleighPhase( float cosTheta ) {\n\t\t\treturn THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );\n\t\t}\n\t\tfloat hgPhase( float cosTheta, float g ) {\n\t\t\tfloat g2 = pow( g, 2.0 );\n\t\t\tfloat inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );\n\t\t\treturn ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );\n\t\t}\n\t\tvoid main() {\n\t\t\tvec3 direction = normalize( vWorldPosition - cameraPos );\n\t\t\t// optical length\n\t\t\t// cutoff angle at 90 to avoid singularity in next formula.\n\t\t\tfloat zenithAngle = acos( max( 0.0, dot( up, direction ) ) );\n\t\t\tfloat inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );\n\t\t\tfloat sR = rayleighZenithLength * inverse;\n\t\t\tfloat sM = mieZenithLength * inverse;\n\t\t\t// combined extinction factor\n\t\t\tvec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );\n\t\t\t// in scattering\n\t\t\tfloat cosTheta = dot( direction, vSunDirection );\n\t\t\tfloat rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );\n\t\t\tvec3 betaRTheta = vBetaR * rPhase;\n\t\t\tfloat mPhase = hgPhase( cosTheta, mieDirectionalG );\n\t\t\tvec3 betaMTheta = vBetaM * mPhase;\n\t\t\tvec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );\n\t\t\tLin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );\n\t\t\t// nightsky\n\t\t\tfloat theta = acos( direction.y ); // elevation --\x3e y-axis, [-pi/2, pi/2]\n\t\t\tfloat phi = atan( direction.z, direction.x ); // azimuth --\x3e x-axis [-pi/2, pi/2]\n\t\t\tvec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );\n\t\t\tvec3 L0 = vec3( 0.1 ) * Fex;\n\t\t\t// composition + solar disc\n\t\t\tfloat sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );\n\t\t\tL0 += ( vSunE * 19000.0 * Fex ) * sundisk;\n\t\t\tvec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );\n\t\t\tvec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );\n\t\t\tgl_FragColor = vec4( retColor, 1.0 );\n\t\t\t#include <tonemapping_fragment>\n\t\t\t#include <encodings_fragment>\n\t\t}"};var f=e(6);var u,p=function(){var t=Object(i.useRef)(null);return Object(i.useEffect)((function(){var n=new s.y;n.setPixelRatio(window.devicePixelRatio),n.setSize(window.innerWidth,window.innerHeight),n.toneMapping=s.a,t.current.appendChild(n.domElement);var e=new s.v,i=window.innerWidth/2,o=window.innerHeight/2;window.addEventListener("mousemove",(function(t){e.x=(t.clientX-i)/20,e.y=(t.clientY-o)/20}),!1);var a=new s.r,r=new s.p(55,window.innerWidth/window.innerHeight,1,2e4);r.focalLength=3,r.position.set(30,30,80);var l=new s.b(4210752,9);a.add(l);var c=new s.w,v=new d;v.scale.setScalar(1e3),a.add(v);var f=v.material.uniforms;f.turbidity.value=6,f.rayleigh.value=2,f.mieCoefficient.value=.005,f.mieDirectionalG.value=.75;var u=2,p=180,h=new s.o(n);!function(){var t=s.j.degToRad(90-u),n=s.j.degToRad(p);c.setFromSphericalCoords(1e7,t,n),v.material.uniforms.sunPosition.value.copy(c),a.environment=h.fromScene(v).texture}();var w=new s.x(256,{format:s.q,generateMipmaps:!0,minFilter:s.i,encoding:s.z}),g=new s.e(1,1e3,w),m=new s.h(1,0),y=new s.h(2,0),x=new s.h(4,0),b=new s.m({envMap:w.texture,combine:s.n,reflectivity:1,opacity:.7,transparent:!0,side:s.f,color:16495615}),j=new s.l({envMap:w.texture,combine:s.n,reflectivity:1,roughness:0,metalness:1,opacity:.67,transparent:!0,side:s.f,color:13026757}),O=new s.k(x,b);O.position.x=30,O.position.y=-5,O.position.z=-5,a.add(O);var E=new s.k(x,b);E.position.x=-30,E.position.y=5,E.position.z=-10,a.add(E);var C=new s.k(x,b);C.position.x=5,C.position.y=10,C.position.z=-6,a.add(C);var S=new s.k(m,b);S.position.x=-22.8,S.position.y=.5,S.position.z=6,a.add(S);var z=new s.k(x,b);z.position.x=-12,z.position.y=-10,z.position.z=-7,a.add(z);var P=new s.k(m,b);P.position.x=20.8,P.position.y=-8,P.position.z=9,a.add(P);var k=new s.k(m,b);k.position.x=40.8,k.position.y=9,k.position.z=5,a.add(k);var M=new s.k(y,b);M.position.x=-42.8,M.position.y=9,M.position.z=5,a.add(M);var R=new s.k(m,b);R.position.x=-45.8,R.position.y=-10,R.position.z=7,a.add(R);var A=new s.k(y,b);A.position.x=45.8,A.position.y=-8,A.position.z=7,a.add(A),(new s.g).load("monoton.json",(function(t){var n=new s.t("JOANNE".split("").join(" "),{font:t,size:16,height:3,curveSegments:12,bevelEnabled:!0,bevelThickness:0,bevelSize:0,bevelOffset:0,bevelSegments:0}),e=new s.k(n,j);n.computeBoundingBox();var i=-.5*(n.boundingBox.max.x-n.boundingBox.min.x),o=-.5*(n.boundingBox.max.y-n.boundingBox.min.y);e.position.x=i,e.position.y=o,a.add(e)}));window.addEventListener("resize",(function(){r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),n.setSize(window.innerWidth,window.innerHeight)})),function t(){requestAnimationFrame(t),function(){var t,i=.001*performance.now();Math.abs(Math.sin(i));O.rotation.x=.4*i,O.rotation.z=.1*i,E.rotation.x=.2*-i,E.rotation.y=.4*i,C.rotation.x=.2*i,C.rotation.z=.4*-i,S.rotation.x=.42*-i,S.rotation.z=.32*-i,z.rotation.y=.19*-i,z.rotation.z=.32*i,P.rotation.x=.4*-i,P.rotation.z=.62*i,k.rotation.y=.6*-i,k.rotation.z=.49*i,M.rotation.y=.6*-i,M.rotation.z=.49*-i,R.rotation.y=.45*i,R.rotation.z=.4*-i,A.rotation.x=.2*i,A.rotation.z=.01*i,r.position.x+=.05*(e.x-r.position.x),r.position.y+=.05*(-e.y-r.position.y),r.lookAt(a.position),t=window.innerWidth>=1800?80:window.innerWidth>=1500?100:window.innerWidth>=1200?120:window.innerWidth>=1070?140:window.innerWidth>=910?160:window.innerWidth>=790?180:window.innerWidth>=700?200:window.innerWidth>=630?220:window.innerWidth>=570?240:window.innerWidth>=520?260:window.innerWidth>=490?280:window.innerWidth>=420?320:window.innerWidth>=370?360:window.innerWidth>=340?400:440;r.position.z=t,g.update(n,a),n.render(a,r)}()}()}),[]),Object(f.jsx)("div",{className:"background",ref:t})},h=["title","titleId"];function w(){return(w=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])}return t}).apply(this,arguments)}function g(t,n){if(null==t)return{};var e,i,o=function(t,n){if(null==t)return{};var e,i,o={},a=Object.keys(t);for(i=0;i<a.length;i++)e=a[i],n.indexOf(e)>=0||(o[e]=t[e]);return o}(t,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(i=0;i<a.length;i++)e=a[i],n.indexOf(e)>=0||Object.prototype.propertyIsEnumerable.call(t,e)&&(o[e]=t[e])}return o}function m(t,n){var e=t.title,o=t.titleId,a=g(t,h);return i.createElement("svg",w({xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",width:24,height:24,viewBox:"0 0 24 24",ref:n,"aria-labelledby":o},a),e?i.createElement("title",{id:o},e):null,u||(u=i.createElement("path",{d:"M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"})))}var y,x=i.forwardRef(m),b=(e.p,["title","titleId"]);function j(){return(j=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])}return t}).apply(this,arguments)}function O(t,n){if(null==t)return{};var e,i,o=function(t,n){if(null==t)return{};var e,i,o={},a=Object.keys(t);for(i=0;i<a.length;i++)e=a[i],n.indexOf(e)>=0||(o[e]=t[e]);return o}(t,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(i=0;i<a.length;i++)e=a[i],n.indexOf(e)>=0||Object.prototype.propertyIsEnumerable.call(t,e)&&(o[e]=t[e])}return o}function E(t,n){var e=t.title,o=t.titleId,a=O(t,b);return i.createElement("svg",j({xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",width:24,height:24,viewBox:"0 0 24 24",ref:n,"aria-labelledby":o},a),e?i.createElement("title",{id:o},e):null,y||(y=i.createElement("path",{d:"M20,18H18V9.25L12,13L6,9.25V18H4V6H5.2L12,10.25L18.8,6H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"})))}var C,S=i.forwardRef(E),z=(e.p,["title","titleId"]);function P(){return(P=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])}return t}).apply(this,arguments)}function k(t,n){if(null==t)return{};var e,i,o=function(t,n){if(null==t)return{};var e,i,o={},a=Object.keys(t);for(i=0;i<a.length;i++)e=a[i],n.indexOf(e)>=0||(o[e]=t[e]);return o}(t,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(i=0;i<a.length;i++)e=a[i],n.indexOf(e)>=0||Object.prototype.propertyIsEnumerable.call(t,e)&&(o[e]=t[e])}return o}function M(t,n){var e=t.title,o=t.titleId,a=k(t,z);return i.createElement("svg",P({xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",width:24,height:24,viewBox:"0 0 24 24",ref:n,"aria-labelledby":o},a),e?i.createElement("title",{id:o},e):null,C||(C=i.createElement("path",{d:"M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"})))}var R=i.forwardRef(M),A=(e.p,function(){return Object(f.jsxs)("div",{className:"info",children:[Object(f.jsx)("a",{className:"button",href:"https://github.com/jojoonthat",target:"_blank",children:Object(f.jsx)(x,{})}),Object(f.jsx)("a",{className:"button",href:"mailto:jpan0917@gmail.com",target:"_blank",children:Object(f.jsx)(S,{})}),Object(f.jsx)("a",{className:"button",href:"https://www.linkedin.com/in/panjoanne",target:"_blank",children:Object(f.jsx)(R,{})})]})});var B=function(){return Object(f.jsxs)("div",{className:"App",children:[Object(f.jsx)(p,{}),Object(f.jsx)(A,{})]})};r.a.render(Object(f.jsx)(o.a.StrictMode,{children:Object(f.jsx)(B,{})}),document.getElementById("root"))}},[[18,1,2]]]);
//# sourceMappingURL=main.2282a491.chunk.js.map