import svgPaths from "./svg-7qj2twbbtq";
import imgMakeButtonInteractive from "figma:asset/4c27daec50b4e1111df198e6cd4006830dbec71f.png";
import imgImage from "figma:asset/773b0834d55c508b618e28a0da9cc005c296dc99.png";
import imgImage1 from "figma:asset/8e4241399baefbe8f8feffab0fe67682e140e1b1.png";
import { imgRoundedRectangle } from "./svg-3gr4u";

function MaskGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Mask group">
      <div className="absolute inset-0 mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[1138px_808px]" data-name="Rounded Rectangle" style={{ maskImage: `url('${imgRoundedRectangle}')` }}>
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1138 808">
          <path d={svgPaths.p4afec40} fill="var(--fill-0, white)" id="Rounded Rectangle" />
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[808px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <MaskGroup />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[808px] items-start left-0 top-0 w-[1138px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Container4() {
  return <div className="absolute bg-white h-px left-[225.23px] top-[9.5px] w-[145px]" data-name="Container" />;
}

function Paragraph() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 top-0 w-[209.234px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">UNE CITATION INSPIRANTE</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[370.234px]" data-name="Container">
      <Container4 />
      <Paragraph />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute content-stretch flex h-[96px] items-start left-0 top-0 w-[422px]" data-name="Paragraph">
      <p className="font-['IM_FELL_French_Canon:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[48px] text-white whitespace-nowrap">Le travail sincère mène au vrai succès.</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute content-stretch flex h-[40px] items-start left-0 top-[121px] w-[400px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#aaabac] text-[16px] whitespace-nowrap">Accédez à un espace d’examen conçu pour assurer transparence, sécurité et égalité des chances.</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[161px] left-0 top-[549px] w-[422px]" data-name="Container">
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[710px] left-[19px] top-[40px] w-[422px]" data-name="Container">
      <Container3 />
      <Container5 />
    </div>
  );
}

function Image() {
  return (
    <div className="absolute h-[23px] left-0 top-0 w-[148px]" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[23px] left-[193px] top-[-5px] w-[148px]" data-name="Container">
      <Image />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[46px] relative shrink-0 w-[544px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['IM_FELL_French_Canon:Regular',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative text-[40px] text-black text-center">Bienvenue à nouveau</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col h-[46px] items-start justify-center left-0 top-0 w-[544px]" data-name="Container">
      <Paragraph3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[48px] relative shrink-0 w-[440px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Light',sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#aaabac] text-[20px] text-center whitespace-nowrap">Entrez votre e-mail et votre mot de passe pour accéder à votre compte</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col h-[48px] items-start justify-center left-[52px] top-[56px] w-[440px]" data-name="Container">
      <Paragraph4 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute h-[104px] left-0 top-0 w-[544px]" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Container13() {
  return <div className="absolute bg-white h-[41px] left-[4px] rounded-[8px] top-[5.5px] w-[186px]" data-name="Container" />;
}

function Button() {
  return (
    <div className="absolute content-stretch flex h-[41px] items-center justify-center left-[4px] top-[5.5px] w-[186px]" data-name="Button">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[18px] text-black text-center whitespace-nowrap">Etudiant</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex h-[41px] items-center justify-center left-[190px] top-[5.5px] w-[186px]" data-name="Button">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[18px] text-center text-white whitespace-nowrap">Professeur</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-black h-[52px] left-[82px] rounded-[10px] top-[126px] w-[380px]" data-name="Container">
      <Container13 />
      <Button />
      <Button1 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[21px] relative shrink-0 w-[381px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px not-italic relative text-[18px] text-black">Email</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col h-[21px] items-start justify-center left-0 top-0 w-[381px]" data-name="Container">
      <Paragraph5 />
    </div>
  );
}

function Container19() {
  return <div className="absolute bg-[#f5f7fb] h-[47px] left-0 rounded-[10px] top-0 w-[381px]" data-name="Container" />;
}

function EmailInput() {
  return (
    <div className="absolute content-stretch flex h-[47px] items-center left-0 overflow-clip px-[14px] top-0 w-[381px]" data-name="Email Input">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#aaabac] text-[16px] whitespace-nowrap">Entrez votre e-mail</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute h-[47px] left-0 top-[32px] w-[381px]" data-name="Container">
      <Container19 />
      <EmailInput />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[381px]" data-name="Container">
      <Container17 />
      <Container18 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[21px] relative shrink-0 w-[381px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px not-italic relative text-[18px] text-black">Mot de passe</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex flex-col h-[21px] items-start justify-center left-0 top-0 w-[381px]" data-name="Container">
      <Paragraph6 />
    </div>
  );
}

function Container24() {
  return <div className="absolute bg-[#f5f7fb] h-[47px] left-0 rounded-[10px] top-0 w-[381px]" data-name="Container" />;
}

function PasswordInput() {
  return (
    <div className="absolute content-stretch flex h-[47px] items-center left-0 overflow-clip pl-[14px] pr-[35px] top-0 w-[381px]" data-name="Password Input">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#aaabac] text-[16px] whitespace-nowrap">Entrez votre mot de passe</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute h-[47px] left-0 top-0 w-[381px]" data-name="Container">
      <Container24 />
      <PasswordInput />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 12">
        <path d={svgPaths.p15e5e300} fill="var(--fill-0, #AAABAC)" id="Vector" />
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex flex-col h-[12px] items-start left-[350px] top-[17px] w-[20px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute h-[47px] left-0 top-[29px] w-[381px]" data-name="Container">
      <Container23 />
      <Container25 />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute h-[76px] left-0 top-[104px] w-[381px]" data-name="Container">
      <Container21 />
      <Container22 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[21px] relative shrink-0 w-[381px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px not-italic relative text-[18px] text-black">Confirmer mot de passe</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute content-stretch flex flex-col h-[21px] items-start justify-center left-0 top-0 w-[381px]" data-name="Container">
      <Paragraph7 />
    </div>
  );
}

function Container30() {
  return <div className="absolute bg-[#f5f7fb] h-[47px] left-0 rounded-[10px] top-0 w-[381px]" data-name="Container" />;
}

function PasswordInput1() {
  return (
    <div className="absolute content-stretch flex h-[47px] items-center left-0 overflow-clip pl-[14px] pr-[35px] top-0 w-[381px]" data-name="Password Input">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#aaabac] text-[16px] whitespace-nowrap">Confirmer le mot de passe</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute h-[47px] left-0 top-0 w-[381px]" data-name="Container">
      <Container30 />
      <PasswordInput1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 12">
        <path d={svgPaths.p15e5e300} fill="var(--fill-0, #AAABAC)" id="Vector" />
      </svg>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex flex-col h-[12px] items-start left-[350px] top-[17px] w-[20px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute h-[47px] left-0 top-[29px] w-[381px]" data-name="Container">
      <Container29 />
      <Container31 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute h-[76px] left-0 top-[205px] w-[381px]" data-name="Container">
      <Container27 />
      <Container28 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[281px] left-[10px] top-0 w-[381px]" data-name="Container">
      <Container16 />
      <Container20 />
      <Container26 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[288px] left-[71.5px] top-[200px] w-[401px]" data-name="Container">
      <Container15 />
    </div>
  );
}

function Container33() {
  return <div className="absolute bg-[#1c1c1c] h-[52px] left-0 rounded-[10px] top-0 w-[380px]" data-name="Container" />;
}

function Paragraph8() {
  return (
    <div className="h-[24px] relative shrink-0 w-[344.531px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-h-px min-w-px not-italic relative text-[20px] text-center text-white">S’inscrire</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex flex-col h-[23.016px] items-start justify-center left-[17.73px] pb-[-0.5px] pt-[-0.484px] top-[15px] w-[344.531px]" data-name="Container">
      <Paragraph8 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[52px] left-0 top-0 w-[380px]" data-name="Button">
      <Container33 />
      <Container34 />
    </div>
  );
}

function Image1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Image">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-[165.859px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#1c1c1c] text-[0px] text-center whitespace-nowrap">
          <span className="leading-[22.5px] text-[15px]">{`S’inscrire avec `}</span>
          <span className="font-['Poppins:Bold',sans-serif] leading-[22.5px] text-[15px]">Google</span>
        </p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[12px] h-[52px] items-center justify-center left-0 pl-[92.063px] pr-[92.078px] py-px rounded-[10px] top-[64px] w-[380px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#f0f0f0] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Image1 />
      <Paragraph9 />
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute h-[45px] left-[82px] top-[510px] w-[380px]" data-name="Container">
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[642px] left-[-5px] top-[44px] w-[544px]" data-name="Container">
      <Container9 />
      <Container12 />
      <Container14 />
      <Container32 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[20px] relative shrink-0 w-[318.359px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[0px] text-black whitespace-nowrap">
          <span className="leading-[normal] text-[16px]">{`Vous avez déjà un compte ? `}</span>
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] text-[16px]">Se connecter</span>
        </p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute content-stretch flex flex-col h-[20px] items-start justify-center left-0 top-0 w-[318.359px]" data-name="Container">
      <Paragraph10 />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute h-[20px] left-[107.81px] overflow-clip top-[712px] w-[318.359px]" data-name="Container">
      <Container36 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[727px] left-[579px] top-[40px] w-[534px]" data-name="Container">
      <Container7 />
      <Container8 />
      <Container35 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[808px] left-[219.5px] overflow-clip rounded-[50px] top-[91px] w-[1138px]" data-name="Container">
      <Container1 />
      <Container2 />
      <Container6 />
    </div>
  );
}

export default function MakeButtonInteractive() {
  return (
    <div className="relative size-full" data-name="Make Button Interactive">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute bg-white inset-0" />
        <img alt="" className="absolute max-w-none object-cover size-full" src={imgMakeButtonInteractive} />
      </div>
      <Container />
    </div>
  );
}