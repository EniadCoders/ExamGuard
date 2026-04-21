import svgPaths from "./svg-vyi60vgz08";
import imgSandroKatalinaK1BOVTiZSsUnsplash22 from "./fd9d1149f82b2ead74cabcb8c47273f4713a6493.png";
import { imgSandroKatalinaK1BOVTiZSsUnsplash21 } from "./svg-ul36i";

function Menu() {
  return (
    <div className="absolute contents font-['Plus_Jakarta_Display:Regular',sans-serif] leading-[1.5] left-[1112px] not-italic text-[#a0aec0] text-[14px] top-[911px] whitespace-nowrap" data-name="Menu">
      <p className="absolute left-[1314px] top-[911px]">License</p>
      <p className="absolute left-[1238px] top-[911px]">Blog</p>
      <p className="absolute left-[1112px] top-[911px]">Marketplace</p>
    </div>
  );
}

function Copyright() {
  return (
    <div className="absolute contents left-[1021px] top-[881px]" data-name="Copyright">
      <p className="-translate-x-1/2 absolute font-['Helvetica:Regular',sans-serif] leading-[0] left-[1237px] not-italic text-[#a0aec0] text-[0px] text-center top-[881px] whitespace-nowrap">
        <span className="font-['Plus_Jakarta_Display:Regular',sans-serif] leading-[1.5] text-[14px]">{`@ 2021, Made with ❤️ by `}</span>
        <span className="font-['Plus_Jakarta_Display:Medium',sans-serif] leading-[1.5] text-[14px]">{`Simmmple & Creative Tim`}</span>
        <span className="font-['Plus_Jakarta_Display:Regular',sans-serif] leading-[1.5] text-[14px]">{` for a better web`}</span>
      </p>
    </div>
  );
}

function FooterMenu() {
  return (
    <div className="absolute contents left-[1021px] top-[881px]" data-name="Footer Menu">
      <Menu />
      <Copyright />
    </div>
  );
}

function Background() {
  return (
    <div className="absolute contents left-0 top-[-6px]" data-name="Background">
      <div className="absolute h-[1038px] left-0 top-[-6px] w-[1920px]" style={{ backgroundImage: "linear-gradient(168.288deg, rgb(15, 18, 59) 14.248%, rgb(9, 13, 46) 56.446%, rgb(2, 5, 21) 86.141%)" }} />
      <FooterMenu />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute bg-[#4fd1c5] h-[1032px] left-0 top-0 w-[960px]" />
      <div className="absolute h-[1328px] left-[-589px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[589px_209px] mask-size-[960px_1032px] top-[-209px] w-[2110px]" data-name="sandro-katalina-k1bO_VTiZSs-unsplash (2) 1" style={{ maskImage: `url('${imgSandroKatalinaK1BOVTiZSsUnsplash21}')` }}>
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgSandroKatalinaK1BOVTiZSsUnsplash22} />
          <div className="absolute inset-0" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 2110 1328\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(-0.85 -43.4 86.873 -1.7014 1095 760)\\'><stop stop-color=\\'rgba(0,0,0,0.78)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }} />
        </div>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute contents leading-none left-[168px] not-italic text-center top-[480px] whitespace-nowrap" data-name="TEXT">
      <p className="-translate-x-1/2 absolute bg-clip-text font-['Plus_Jakarta_Display:Bold',sans-serif] left-[480px] text-[36px] text-[transparent] top-[516px] tracking-[6.48px]" style={{ backgroundImage: "linear-gradient(144.09deg, rgb(255, 255, 255) 79.994%, rgb(33, 36, 47) 102.65%)" }}>
        THE VISION UI DASHBOARD
      </p>
      <p className="-translate-x-1/2 absolute font-['Plus_Jakarta_Display:Regular',sans-serif] left-[480px] text-[20px] text-white top-[480px] tracking-[3.6px]">INSPIRED BY THE FUTURE:</p>
    </div>
  );
}

function Image() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Image">
      <Group />
      <Text />
    </div>
  );
}

function ButtonBody() {
  return (
    <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0" data-name="Button Body">
      <div className="flex flex-col font-['Plus_Jakarta_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white whitespace-nowrap">
        <p className="leading-[1.5]">SIGN IN</p>
      </div>
    </div>
  );
}

function HeightStructure() {
  return (
    <div className="content-stretch flex h-[24px] items-center relative shrink-0" data-name="Height Structure">
      <ButtonBody />
    </div>
  );
}

function MinWidth() {
  return (
    <div className="content-stretch flex items-start overflow-clip px-[12px] relative shrink-0" data-name="🔛MinWidth">
      <div className="bg-[#c4c4c4] shrink-0 size-[0.005px]" data-name="Content" />
    </div>
  );
}

function WidthStructure() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0" data-name="Width Structure">
      <HeightStructure />
      <MinWidth />
    </div>
  );
}

function ButtonBase() {
  return (
    <div className="absolute backdrop-blur-[60px] bg-[#0075ff] content-stretch flex inset-[61.23%_26.41%_34.41%_55.36%] items-center justify-center px-[8px] rounded-[12px]" data-name="_Button/Base">
      <WidthStructure />
    </div>
  );
}

function SwitchBase() {
  return (
    <div className="absolute bg-[#0075ff] content-stretch flex flex-col inset-[55.96%_42.76%_42.25%_55.36%] items-end justify-center overflow-clip pl-[1.437px] pr-[2.5px] py-[1.437px] rounded-[97.74px]" data-name="_Switch/Base">
      <div className="relative shrink-0 size-[13.5px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
          <circle cx="6.75" cy="6.75" fill="var(--fill-0, white)" id="Ellipse 1" r="6.75" />
        </svg>
      </div>
    </div>
  );
}

function RememberMe() {
  return (
    <div className="absolute contents left-[1063px] top-[577.48px]" data-name="Remember Me">
      <p className="absolute font-['Plus_Jakarta_Display:Medium',sans-serif] leading-[1.5] left-[1109px] not-italic text-[12px] text-white top-[578px] whitespace-nowrap">{`Remember me `}</p>
      <SwitchBase />
    </div>
  );
}

function MinWidth1() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip px-[74px] relative shrink-0" data-name="🔛MinWidth">
      <div className="shrink-0 size-[0.005px]" data-name="Content" />
    </div>
  );
}

function InputFieldText() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 w-[311px]" data-name="_Input/FieldText">
      <p className="font-['Plus_Jakarta_Display:Medium',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#a0aec0] text-[14px] whitespace-nowrap">Your password</p>
      <MinWidth1 />
    </div>
  );
}

function Email() {
  return (
    <div className="absolute backdrop-blur-[21px] inset-[48.79%_26.41%_46.37%_55.36%] rounded-[20px]" data-name="Email" style={{ backgroundImage: "linear-gradient(164.637deg, rgba(255, 255, 255, 0) 3.9102%, rgba(255, 255, 255, 0.04) 75.269%)" }}>
      <div className="content-stretch flex items-center overflow-clip px-[20px] relative rounded-[inherit] size-full">
        <InputFieldText />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#151515] border-solid inset-[-2px] pointer-events-none rounded-[22px]" />
    </div>
  );
}

function Password() {
  return (
    <div className="absolute contents left-[1063px] top-[479px]" data-name="Password">
      <Email />
      <p className="absolute font-['Plus_Jakarta_Display:Medium',sans-serif] leading-[1.4] left-[1067.5px] not-italic text-[14px] text-white top-[479px] whitespace-nowrap">Password</p>
    </div>
  );
}

function MinWidth2() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip px-[74px] relative shrink-0" data-name="🔛MinWidth">
      <div className="shrink-0 size-[0.005px]" data-name="Content" />
    </div>
  );
}

function InputFieldText1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 w-[311px]" data-name="_Input/FieldText">
      <p className="font-['Plus_Jakarta_Display:Medium',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#a0aec0] text-[14px] whitespace-nowrap">Your email address</p>
      <MinWidth2 />
    </div>
  );
}

function Email2() {
  return (
    <div className="absolute backdrop-blur-[21px] inset-[39.21%_26.41%_55.95%_55.36%] rounded-[20px]" data-name="Email" style={{ backgroundImage: "linear-gradient(164.637deg, rgba(255, 255, 255, 0) 3.9102%, rgba(255, 255, 255, 0.04) 75.269%)" }}>
      <div className="content-stretch flex items-center overflow-clip px-[20px] relative rounded-[inherit] size-full">
        <InputFieldText1 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#151515] border-solid inset-[-2px] pointer-events-none rounded-[22px]" />
    </div>
  );
}

function Email1() {
  return (
    <div className="absolute contents left-[1063px] top-[380px]" data-name="Email">
      <Email2 />
      <p className="absolute font-['Plus_Jakarta_Display:Medium',sans-serif] leading-[1.4] left-[1067.5px] not-italic text-[14px] text-white top-[380px] whitespace-nowrap">Email</p>
    </div>
  );
}

function Title() {
  return (
    <div className="absolute contents left-[1063px] not-italic top-[279px] whitespace-nowrap" data-name="Title">
      <p className="absolute font-['Plus_Jakarta_Display:Medium',sans-serif] leading-[1.4] left-[1063px] text-[#a0aec0] text-[14px] top-[324.5px]">Enter your email and password to sign in</p>
      <p className="absolute font-['Plus_Jakarta_Display:Bold',sans-serif] leading-[1.3] left-[1063px] text-[30px] text-white top-[279px]">Nice to see you!</p>
    </div>
  );
}

function Inputs() {
  return (
    <div className="absolute contents left-[1063px] top-[279px]" data-name="Inputs">
      <p className="-translate-x-1/2 absolute font-['Helvetica:Bold',sans-serif] leading-[0] left-[1238px] not-italic text-[#a0aec0] text-[0px] text-center top-[699.5px] whitespace-nowrap">
        <span className="font-['Plus_Jakarta_Display:Medium',sans-serif] leading-[1.4] text-[14px]">{`Don't have an `}</span>
        <span className="font-['Plus_Jakarta_Display:Medium',sans-serif] leading-[1.4] text-[14px]">account</span>
        <span className="font-['Plus_Jakarta_Display:Medium',sans-serif] leading-[1.4] text-[14px]">?</span>
        <span className="font-['Plus_Jakarta_Display:Bold',sans-serif] leading-[1.4] text-[14px]">{` `}</span>
        <span className="font-['Plus_Jakarta_Display:Bold',sans-serif] leading-[1.4] text-[14px] text-white">Sign up</span>
      </p>
      <ButtonBase />
      <RememberMe />
      <Password />
      <Email1 />
      <Title />
    </div>
  );
}

function Background1() {
  return (
    <div className="absolute contents left-[466px] top-[24px]" data-name="Background">
      <div className="absolute backdrop-blur-[21px] h-[70px] left-[466px] rounded-[20px] top-[24px] w-[987.5px]" style={{ backgroundImage: "linear-gradient(173.918deg, rgba(255, 255, 255, 0) 22.382%, rgba(255, 255, 255, 0.04) 70.376%)" }}>
        <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-[-2px] pointer-events-none rounded-[22px]" />
      </div>
    </div>
  );
}

function ButtonBody1() {
  return (
    <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0" data-name="Button Body">
      <div className="flex flex-col font-['Plus_Jakarta_Display:Bold',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white w-[89.5px]">
        <p className="leading-[1.5]">Free Download</p>
      </div>
    </div>
  );
}

function HeightStructure1() {
  return (
    <div className="content-stretch flex h-[24px] items-center relative shrink-0" data-name="Height Structure">
      <ButtonBody1 />
    </div>
  );
}

function MinWidth3() {
  return (
    <div className="content-stretch flex items-start overflow-clip px-[12px] relative shrink-0" data-name="🔛MinWidth">
      <div className="bg-[#c4c4c4] shrink-0 size-[0.005px]" data-name="Content" />
    </div>
  );
}

function WidthStructure1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0" data-name="Width Structure">
      <HeightStructure1 />
      <MinWidth3 />
    </div>
  );
}

function ButtonBase1() {
  return (
    <div className="absolute backdrop-blur-[60px] bg-[#0075ff] content-stretch flex inset-[4.02%_25.55%_92.59%_66.64%] items-center justify-center px-[8px] rounded-[12px]" data-name="_Button/Base">
      <WidthStructure1 />
    </div>
  );
}

function ButtonBody2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Button Body">
      <div className="overflow-clip relative shrink-0 size-[11px]" data-name="Icon">
        <div className="absolute inset-[9.38%_9.37%_9.37%_9.38%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.9375 8.93754">
            <path d={svgPaths.p1193b300} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Plus_Jakarta_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white whitespace-nowrap">
        <p className="leading-[1.5]">SIGN IN</p>
      </div>
    </div>
  );
}

function HeightStructure2() {
  return (
    <div className="content-stretch flex h-[24px] items-center relative shrink-0" data-name="Height Structure">
      <ButtonBody2 />
    </div>
  );
}

function MinWidth4() {
  return (
    <div className="content-stretch flex items-start overflow-clip px-[12px] relative shrink-0" data-name="🔛MinWidth">
      <div className="bg-[#c4c4c4] shrink-0 size-[0.005px]" data-name="Content" />
    </div>
  );
}

function WidthStructure2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0" data-name="Width Structure">
      <HeightStructure2 />
      <MinWidth4 />
    </div>
  );
}

function SignIn() {
  return (
    <div className="absolute content-stretch flex inset-[4.65%_40.16%_93.17%_56.69%] items-center justify-center px-[8px] rounded-[12px]" data-name="Sign In">
      <WidthStructure2 />
    </div>
  );
}

function ButtonBody3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Button Body">
      <div className="overflow-clip relative shrink-0 size-[11px]" data-name="Icon">
        <div className="absolute inset-[9.37%_9.37%_9.38%_9.38%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.9375 8.9375">
            <path d={svgPaths.p190b4780} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Plus_Jakarta_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white whitespace-nowrap">
        <p className="leading-[1.5]">SIGN UP</p>
      </div>
    </div>
  );
}

function HeightStructure3() {
  return (
    <div className="content-stretch flex h-[24px] items-center relative shrink-0" data-name="Height Structure">
      <ButtonBody3 />
    </div>
  );
}

function MinWidth5() {
  return (
    <div className="content-stretch flex items-start overflow-clip px-[12px] relative shrink-0" data-name="🔛MinWidth">
      <div className="bg-[#c4c4c4] shrink-0 size-[0.005px]" data-name="Content" />
    </div>
  );
}

function WidthStructure3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0" data-name="Width Structure">
      <HeightStructure3 />
      <MinWidth5 />
    </div>
  );
}

function SignUp() {
  return (
    <div className="absolute content-stretch flex inset-[4.65%_44.82%_93.17%_52.03%] items-center justify-center px-[8px] rounded-[12px]" data-name="Sign Up">
      <WidthStructure3 />
    </div>
  );
}

function ButtonBody4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Button Body">
      <div className="overflow-clip relative shrink-0 size-[11px]" data-name="Icon">
        <div className="absolute bottom-1/2 left-[29.69%] right-[29.69%] top-[6.25%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.46871 4.8125">
            <path d={svgPaths.p2139c700} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[56.24%_9.37%_6.26%_9.37%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.93774 4.12506">
            <path d={svgPaths.p151cec80} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Plus_Jakarta_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white whitespace-nowrap">
        <p className="leading-[1.5]">PROFILE</p>
      </div>
    </div>
  );
}

function HeightStructure4() {
  return (
    <div className="content-stretch flex h-[24px] items-center relative shrink-0" data-name="Height Structure">
      <ButtonBody4 />
    </div>
  );
}

function MinWidth6() {
  return (
    <div className="content-stretch flex items-start overflow-clip px-[12px] relative shrink-0" data-name="🔛MinWidth">
      <div className="bg-[#c4c4c4] shrink-0 size-[0.005px]" data-name="Content" />
    </div>
  );
}

function WidthStructure4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0" data-name="Width Structure">
      <HeightStructure4 />
      <MinWidth6 />
    </div>
  );
}

function Profile() {
  return (
    <div className="absolute content-stretch flex inset-[4.65%_49.48%_93.17%_47.37%] items-center justify-center px-[8px] rounded-[12px]" data-name="Profile">
      <WidthStructure4 />
    </div>
  );
}

function ButtonBody5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Button Body">
      <div className="overflow-clip relative shrink-0 size-[11px]" data-name="Icon">
        <div className="absolute inset-[6.25%_13.5%_52.26%_13.5%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.02975 4.56396">
            <path d={svgPaths.p3e9a1880} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[31.82%_53.12%_6.25%_9.38%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.125 6.81209">
            <path d={svgPaths.p3437e380} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[31.83%_9.37%_6.26%_53.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.125 6.81015">
            <path d={svgPaths.p399c4040} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Plus_Jakarta_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white whitespace-nowrap">
        <p className="leading-[1.5]">DASHBOARD</p>
      </div>
    </div>
  );
}

function HeightStructure5() {
  return (
    <div className="content-stretch flex h-[24px] items-center relative shrink-0" data-name="Height Structure">
      <ButtonBody5 />
    </div>
  );
}

function MinWidth7() {
  return (
    <div className="content-stretch flex items-start overflow-clip px-[12px] relative shrink-0" data-name="🔛MinWidth">
      <div className="bg-[#c4c4c4] shrink-0 size-[0.005px]" data-name="Content" />
    </div>
  );
}

function WidthStructure5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0" data-name="Width Structure">
      <HeightStructure5 />
      <MinWidth7 />
    </div>
  );
}

function Dashboard() {
  return (
    <div className="absolute content-stretch flex inset-[4.65%_54.14%_93.17%_41.61%] items-center justify-center px-[8px] rounded-[12px]" data-name="Dashboard">
      <WidthStructure5 />
    </div>
  );
}

function Pages() {
  return (
    <div className="absolute contents inset-[4.65%_40.16%_93.17%_41.61%]" data-name="Pages">
      <SignIn />
      <SignUp />
      <Profile />
      <Dashboard />
    </div>
  );
}

function Logo() {
  return (
    <div className="absolute contents left-[489px] top-[50px]" data-name="Logo">
      <p className="absolute bg-clip-text font-['Plus_Jakarta_Display:Medium',sans-serif] leading-none left-[489px] not-italic text-[14px] text-[transparent] top-[50px] tracking-[2.52px] whitespace-nowrap" style={{ backgroundImage: "linear-gradient(143.184deg, rgb(255, 255, 255) 70.67%, rgba(117, 122, 140, 0) 108.55%)" }}>
        VISION UI FREE
      </p>
    </div>
  );
}

function Menu1() {
  return (
    <div className="absolute contents left-[466px] top-[24px]" data-name="Menu">
      <Background1 />
      <ButtonBase1 />
      <Pages />
      <Logo />
    </div>
  );
}

function MainDashboard() {
  return (
    <div className="absolute contents left-0 top-[-6px]" data-name="Main Dashboard">
      <Background />
      <Image />
      <Inputs />
      <Menu1 />
    </div>
  );
}

function NewDesign() {
  return (
    <div className="absolute contents left-0 top-[-6px]" data-name="New Design">
      <MainDashboard />
    </div>
  );
}

export default function SignInScreen() {
  return (
    <div className="relative size-full" data-name="Sign In Screen">
      <NewDesign />
    </div>
  );
}