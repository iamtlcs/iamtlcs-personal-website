type Certification = {
    name: string;
    code: string;
    image: string;
    link: string;
    credId: string;
    inProgress: boolean;
};

export const certifications: Certification[] = [
    {
        name: "AWS Certified Solutions Architect Associate",
        code: "SAA-C03",
        image: "/certs/AWSSAA.png",
        link: "https://www.credly.com/badges/32254c30-d8ae-4008-a6bd-73e9cea989c9/public_url",
        credId: "GG3C2V61VBF4QDCP",
        inProgress: false,
    },
    {
        name: "Microsoft Certified: Azure Administrator Associate",
        code: "AZ-104",
        image: "/certs/AZ104.png",
        link: "https://learn.microsoft.com/api/credentials/share/en-us/SimonCheung-9261/86D0AC7A6C063680?sharingId=E3128B750A7AE2C1",
        credId: "86D0AC7A6C063680",
        inProgress: false,
    },
    {
        name: "eLearnSecurity Junior Penetration Tester",
        code: "eJPT",
        image: "/certs/eJPT.png",
        link: "https://certs.ine.com/1614ea62-93cf-478d-aad8-103fcb032584#acc.CWKE7QsS",
        credId: "157743669",
        inProgress: false,
    },
    {
        name: "Security Blue Team: Blue Team Level 1 (BTL1)",
        code: "BTL1",
        image: "/certs/BTL1.png",
        link: "https://www.credly.com/badges/0859bf60-47d8-4b93-b08a-7ce821253765/public_url",
        credId: "0859bf60-47d8-4b93-b08a-7ce821253765",
        inProgress: false,
    },
    {
        name: "Certified Kubernetes Administrator (CKA)",
        code: "CKA",
        image: "/certs/CKA.png",
        link: "https://www.credly.com/badges/4a840b01-ebcd-4fc1-92fb-04a748c55f8b/public_url",
        credId: "LF-1u6yuifv2n",
        inProgress: false,
    },
    {
        name: "AWS Certified Solutions Architect Professional",
        code: "SAP-C02",
        image: "/certs/AWSSAP.png",
        link: "https://www.credly.com/badges/a6db0c89-c9aa-470a-a9f4-75e3e9cc4a3c/",
        credId: "ff8b5f25d4f64f9a9144b36df4196138",
        inProgress: false,
    },
];
