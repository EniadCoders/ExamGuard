import svgPaths from "./svg-2659xsjq7l";
import imgLogo from "figma:asset/59a7775f5e017d08337af1cfe4c068b69bdcb460.png";

function Logo() {
  return (
    <div className="absolute h-[112px] left-0 top-0 w-[205.328px]" data-name="Logo">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo} />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[112px] relative shrink-0 w-[862px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Logo />
      </div>
    </div>
  );
}

function Container4() {
  return <div className="absolute bg-black left-[12px] opacity-94 rounded-[33554400px] size-[6px] top-[11px]" data-name="Container" />;
}

function Container3() {
  return (
    <div className="absolute bg-[#f5f5f5] border border-[#e5e5e5] border-solid h-[30px] left-0 rounded-[33554400px] top-0 w-[225.219px]" data-name="Container">
      <Container4 />
      <p className="absolute font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] left-[26px] text-[12px] text-black top-[5px] whitespace-nowrap">{`Plateforme certifiée & sécurisée`}</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[120px] leading-[60px] left-0 text-[48px] text-black top-[58px] tracking-[-1.2px] w-[862px] whitespace-nowrap" data-name="Heading 1">
      <p className="absolute left-0 top-[-1px]">Examens sécurisés.</p>
      <p className="absolute left-0 top-[59px]">Résultats fiables.</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[87.75px] left-0 top-[198px] w-[448px]" data-name="Paragraph">
      <p className="absolute font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[29.25px] left-0 text-[#666] text-[18px] top-0 w-[419px]">{`ExamGuard combine surveillance intelligente et interface fluide pour garantir l'intégrité de chaque évaluation.`}</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[285.75px] relative shrink-0 w-[862px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container3 />
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p37f49070} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[10px] shrink-0 size-[36px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] py-px relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] left-0 text-[14px] text-black top-0 whitespace-nowrap">Proctoring en temps réel</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#666] text-[12px] whitespace-nowrap">{`Surveillance IA comportementale et détection d'anomalies en temps réel`}</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[38px] relative shrink-0 w-[410.75px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Paragraph1 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[16px] h-[72px] items-start left-0 pb-px pl-[17px] pr-px pt-[17px] rounded-[16px] top-0 w-[862px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container7 />
      <Container8 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[10px] shrink-0 size-[36px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] py-px relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] left-0 text-[14px] text-black top-0 whitespace-nowrap">Mode sécurisé avancé</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#666] text-[12px] whitespace-nowrap">{`Verrouillage du navigateur et détection des changements d'onglet`}</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[38px] relative shrink-0 w-[374.547px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Paragraph3 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[16px] h-[72px] items-start left-0 pb-px pl-[17px] pr-px pt-[17px] rounded-[16px] top-[88px] w-[862px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container10 />
      <Container11 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1d59db00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[10px] shrink-0 size-[36px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] py-px relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] left-0 text-[14px] text-black top-0 whitespace-nowrap">Alertes instantanées</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#666] text-[12px] whitespace-nowrap">Notifications en direct pour les tentatives de fraude</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[38px] relative shrink-0 w-[288.734px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Paragraph5 />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[16px] h-[72px] items-start left-0 pb-px pl-[17px] pr-px pt-[17px] rounded-[16px] top-[176px] w-[862px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container13 />
      <Container14 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p90824c0} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12 11.3333V6" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8.66667 11.3333V3.33333" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 11.3333V9.33333" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[10px] shrink-0 size-[36px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] py-px relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] left-0 text-[14px] text-black top-0 whitespace-nowrap">Analyses détaillées</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#666] text-[12px] whitespace-nowrap">{`Rapports complets sur les performances et l'intégrité`}</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[38px] relative shrink-0 w-[300.344px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Paragraph7 />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[16px] h-[72px] items-start left-0 pb-px pl-[17px] pr-px pt-[17px] rounded-[16px] top-[264px] w-[862px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container16 />
      <Container17 />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[336px] relative shrink-0 w-[862px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container6 />
        <Container9 />
        <Container12 />
        <Container15 />
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[16px] relative shrink-0 w-[862px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#888] text-[12px]">© 2026 ExamGuard. Tous droits réservés.</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[990px] relative shrink-0 w-[959px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between pb-[48.016px] pl-[48px] pr-px pt-[48px] relative size-full">
        <Container1 />
        <Container2 />
        <Container5 />
        <Paragraph9 />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[36px] left-0 text-[30px] text-black top-0 whitespace-nowrap">Bienvenue</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[0] left-0 text-[#666] text-[0px] top-[-1px] whitespace-nowrap">
        <span className="leading-[24px] text-[16px]">{`Connectez-vous à votre espace `}</span>
        <span className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[24px] text-[16px] text-black">ExamGuard</span>
      </p>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[68px] items-start left-0 top-0 w-[448px]" data-name="Container">
      <Heading1 />
      <Paragraph10 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-black flex-[217_0_0] h-[40px] min-h-px min-w-px relative rounded-[10px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.12)]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[20px] left-[108.72px] text-[14px] text-center text-white top-[10px] whitespace-nowrap">Étudiant</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="flex-[217_0_0] h-[40px] min-h-px min-w-px relative rounded-[10px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[20px] left-[108.8px] text-[#666] text-[14px] text-center top-[10px] whitespace-nowrap">Administrateur</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[4px] h-[50px] items-center left-0 px-[5px] py-px rounded-[14px] top-[100px] w-[448px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Button />
      <Button1 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2b283480} id="Vector" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pbc77700} id="Vector_2" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[16px] relative shrink-0 w-[275.641px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#666] text-[12px] whitespace-nowrap">Connexion chiffrée TLS 1.3 · Données sécurisées</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center justify-center left-0 pl-[76.172px] pr-[76.188px] top-[554px] w-[448px]" data-name="Container">
      <Icon4 />
      <Text />
    </div>
  );
}

function Label() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] left-0 text-[14px] text-black top-0 whitespace-nowrap">Adresse e-mail</p>
    </div>
  );
}

function EmailInput() {
  return (
    <div className="bg-white h-[50px] relative rounded-[14px] shrink-0 w-full" data-name="Email Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#888] text-[16px] whitespace-nowrap">etudiant@universite.fr</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[78px] items-start relative shrink-0 w-full" data-name="Container">
      <Label />
      <EmailInput />
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[90.172px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] left-0 text-[14px] text-black top-0 whitespace-nowrap">Mot de passe</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[16px] relative shrink-0 w-[125.438px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">Mot de passe oublié ?</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label1 />
      <Button2 />
    </div>
  );
}

function PasswordInput() {
  return (
    <div className="absolute bg-white h-[50px] left-0 rounded-[14px] top-0 w-[380px]" data-name="Password Input">
      <div className="content-stretch flex items-center overflow-clip pl-[16px] pr-[44px] py-[12px] relative rounded-[inherit] size-full">
        <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#888] text-[16px] whitespace-nowrap">••••••••</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.84%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6673 10.6658">
            <path d={svgPaths.pb85f580} id="Vector" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 5.33333">
            <path d={svgPaths.p36446d40} id="Vector" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[344px] pt-[4px] px-[4px] size-[24px] top-[13px]" data-name="Button">
      <Icon5 />
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[50px] relative shrink-0 w-full" data-name="Container">
      <PasswordInput />
      <Button3 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[78px] items-start relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <Container27 />
    </div>
  );
}

function Checkbox() {
  return <div className="shrink-0 size-[16px]" data-name="Checkbox" />;
}

function Label2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[125.75px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] left-0 text-[#666] text-[14px] top-0 whitespace-nowrap">Se souvenir de moi</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex gap-[10px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Checkbox />
      <Label2 />
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[262.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[24px] left-[131.5px] text-[16px] text-center text-white top-[-1px] whitespace-nowrap">Se connecter en tant que Étudiant</p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-black h-[48px] relative rounded-[14px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.16)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[46.797px] relative size-full">
          <Text1 />
          <Icon6 />
        </div>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[284px] items-start relative shrink-0 w-full" data-name="Form">
      <Container24 />
      <Container25 />
      <Container28 />
      <Button4 />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[352px] items-start left-0 pb-[2px] pt-[34px] px-[34px] rounded-[16px] top-[178px] w-[448px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]" />
      <Form />
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[570px] relative shrink-0 w-[448px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container20 />
        <Container21 />
        <Container22 />
        <Container23 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-[#fafafa] flex-[959_0_0] h-[990px] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[255.5px] relative size-full">
          <Container19 />
        </div>
      </div>
    </div>
  );
}

export default function ExamGuardCopy() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="ExamGuard (Copy)">
      <Container />
      <Container18 />
    </div>
  );
}