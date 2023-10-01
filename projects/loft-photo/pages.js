const pagesMap = {
    login: '.page-login',
    main: '.page-main',
    profile: '.page-profile',
  };
  
  export default {
    openPage(name) {
        let page;
        for (const key in pagesMap) {
            page = document.querySelector(pagesMap[key]);
            page.classList.add('hidden');
            if (key == name) {
                page.classList.remove('hidden');
            }
        }
    },
  };