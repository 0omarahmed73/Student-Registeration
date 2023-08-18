document.querySelector('.arrow').addEventListener('click' , (e) => {
  document.querySelector('.sidebar').classList.toggle('hide');
  document.querySelector('.opacity').classList.toggle('hide');
})
document.querySelector('.nav-arrow').addEventListener('click' , (e) => {
document.querySelector('.sidebar').classList.toggle('hide');
document.querySelector('.nav-arrow').classList.toggle('showen');
document.querySelector('.opacity').classList.toggle('hide');
})
document.querySelector('.opacity').addEventListener('click' , (e) => {
  document.querySelector('.sidebar').classList.add('hide');
  document.querySelector('.nav-arrow').classList.remove('showen');
  document.querySelector('.opacity').classList.add('hide');
})
document.querySelector('.fa-right-from-bracket').addEventListener('click' , () => {
  fetch('/logout' , {method : 'GET'}).then (value => value.json())
  .then( data => window.location.href = data.redirect)
  .catch(err => console.log(err))
})

if (window.localStorage.mode)
{
  if (window.localStorage.mode === 'dark') {
  document.body.classList.add('dark');
}
else {
  document.body.classList.remove('dark');
}
}
else {
  window.localStorage.mode = 'light';
}

if (!window.location.href.includes('givenCertificates')) {
  sessionStorage.department = '';
  sessionStorage['en-desc2'] = '';
  sessionStorage['ar-desc2'] = '';
  sessionStorage.certificateCode = '';
  sessionStorage.department = '';
  window.sessionStorage.trainningYear = false;
}
if (!window.location.href.includes('hierarchy/add-sub-point') && !window.location.href.includes('exams/add')) {
  sessionStorage.natural = '';
  sessionStorage.natural1 = 'دور امتحان';
  sessionStorage.level = '';
  sessionStorage['subPointEnDesc'] = '';
  sessionStorage['subPointArDesc'] = '';
  sessionStorage.pointCode = '';
  sessionStorage.order = '';
  window.sessionStorage.hide = false;
}

if (!window.location.href.includes('add-new-slate')) {
  sessionStorage.governcode = '';
  sessionStorage['ardesc'] = '';
  sessionStorage.date = '';
  sessionStorage.notes = '';
  window.sessionStorage.slatecode = '';
  sessionStorage.year = '';
  sessionStorage.endesc = '';
  sessionStorage.nameSlate = '';
  sessionStorage.type = '';
  sessionStorage.study = '';
  window.sessionStorage.trainningYear = false;
  sessionStorage.currentSlate = '';
  window.sessionStorage.nextStds = false;
}

function returnBack(){
  window.location.href = document.referrer;
}

function done() {
  if (document.referrer === 'http://localhost:3000/home/done') {
    history.go(-4);
  }
  else {
    history.back();
  }
}

if (!window.location.href.includes('/sections/add') && !window.location.href.includes('addNewBranch')) {
  sessionStorage.sectionBranchCode = '';
  sessionStorage['sectionBranchDesc'] = '';
 
}

// Switch Themes
console.log(document.querySelector('.iconDiv'));
document.addEventListener('click' , (e) => {
  console.log(e.target);
  if (e.target === document.querySelector('.iconDiv i') || e.target === document.querySelector('.iconDiv'))
  document.body.classList.toggle('dark')
  if (document.body.classList.contains('dark'))
  {
    window.localStorage.mode = 'dark'
    document.querySelector('.iconDiv i').className = 'fa-solid fa-moon'
  }
  else
  {
    window.localStorage.mode = 'light'
    document.querySelector('.iconDiv i').className = 'fa-solid fa-sun'
  }
})

setTimeout(() => {
  if (document.querySelector('.pop-up .doneToast .right') && location.href.includes('addNewBranch')) {
    document.querySelector('.pop-up').style.opacity = 0
    history.go(-1);
  }
  else if (document.querySelector('.pop-up .doneToast .right') && location.href.includes('/add-sub-point/')) {
    document.querySelector('.pop-up').style.opacity = 0
    history.go(-1);
  }
  else if (document.querySelector('.pop-up .doneToast .right') && !location.href.includes('add-new-slate')){
    document.querySelector('.pop-up').style.opacity = 0
    history.go(-1);
  }
  else if (document.querySelector('.pop-up .doneToast .right') && location.href.includes('add-new-slate')) {
    document.querySelector('.pop-up').style.opacity = 0
    location.href = `http://localhost:3000/home/edit-slates`;
  }
  else if (document.querySelector('.pop-up .errorToast .right')) {
    document.querySelector('.pop-up').style.opacity = 0
  setTimeout(() => {
    document.querySelector('.pop-up').style.zIndex = -1
  } , 1000);
  }
} , 1000)

window.onload = () => {
  if (document.querySelector('.pop-up .doneToast .right')) {
   document.querySelectorAll('input').forEach(el => {
    if (el.id === 'slate_code' || el.id === 'main' || el.id === 'slateCode' || el.id === 'natural1') {
      el.value = el.value 
      sessionStorage[el.id] = el.value
    }
    else {
      el.value = '';
      sessionStorage[el.id] = ''
    }
   })
  }
}