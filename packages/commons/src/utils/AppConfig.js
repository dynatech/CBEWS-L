// const AppDir = "'C:\\Users\\John Louie"
 const AppDir = "/home/dynaslope"
// const AppDir = "/home/pulidongz/Projects/CBEWS-L"

 const web_ip = "https://dynaslope.phivolcs.dost.gov.ph"
// const web_ip = "http://192.168.0.172"

const AppConfig = {
    HOSTNAME: `${web_ip}:5000`,
    HOST_DIR: `${web_ip}`,
    UMINGAN_DIR: `${AppDir}/CBEWS-L/packages/commons/src/client-cbewsl/UMINGAN`,
    MARIRONG_DIR: `${AppDir}/CBEWS-L/packages/commons/src/client-cbewsl/MARIRONG`
    // UMINGAN_DIR: `${AppDir}\\CBEWS-L\\packages\\commons\\src\\client-cbewsl\\UMINGAN'`,
    // MARIRONG_DIR: `${AppDir}\\CBEWS-L\\packages\\commons\\src\\client-cbewsl\\MARIRONG'`
};

export default AppConfig
