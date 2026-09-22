/* إيلارا - JavaScript مبسط: تصفية، تفاصيل AJAX، والتحقق من النماذج */
$(document).ready(function () {

  // تصفية صور التصاميم
  $('.filter-btn').click(function () {
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
    var category = $(this).attr('data-filter');
    $('.gallery-item').hide();
    if (category === 'all') {
      $('.gallery-item').show();
    } else {
      $('.gallery-item[data-category*="' + category + '"]').show();
    }
  });

  // تفاصيل التصميم في نافذة Bootstrap باستخدام AJAX
  $('.btn-view-modal').click(function () {
    var id = $(this).attr('data-id');
    var image = $(this).closest('.gallery-card').find('img').attr('src');
    $('#projectModalBody').html('<p>جاري تحميل تفاصيل التصميم...</p>');
    bootstrap.Modal.getOrCreateInstance(document.getElementById('projectModal')).show();

    $.ajax({
      url: 'libs/projects.json',
      dataType: 'json',
      success: function (data) { showDetails(data[id], image); },
      error: function () { $('#projectModalBody').text('تعذر تحميل التفاصيل. افتحي المشروع باستخدام Live Server المحلي.'); }
    });
  });

  function showDetails(project, image) {
    if (!project) return;
    var list = '';
    for (var i = 0; i < project.specs.length; i++) {
      list += '<li class="mb-1"><i class="fas fa-check text-success ms-2"></i>' + project.specs[i] + '</li>';
    }
    var content = '<div class="row g-3">' +
      '<div class="col-md-5"><img src="' + image + '" class="img-fluid rounded project-detail-image" alt="' + project.title + '"></div>' +
      '<div class="col-md-7"><h5 class="fw-bold mb-1 project-detail-heading">' + project.title + '</h5>' +
      '<p class="text-muted small mb-2">' + project.category + ' | ' + project.area + ' | ' + project.year + '</p>' +
      '<p class="small text-secondary mb-3">' + project.description + '</p>' +
      '<h6 class="fw-bold small project-detail-heading">أبرز المواصفات:</h6>' +
      '<ul class="list-unstyled small ps-0">' + list + '</ul></div></div>';
    $('#projectModalBody').html(content);
  }

  // دالة واحدة للتحقق من الحقول بدل تكرار نفس الكود في كل نموذج
  function checkField(selector, correct) {
    var field = $(selector);
    var value = field.val();
    var empty = value === null || String(value).trim() === '';
    var label = field.closest('div').find('label').first().text().replace('*', '').trim();
    var feedback = field.siblings('.invalid-feedback');
    if (empty) {
      feedback.text(field.is('select') ? 'يرجى اختيار ' + label : 'يرجى إدخال ' + label);
    } else if (selector === '#regPassConfirm') {
      feedback.text('كلمتا المرور غير متطابقتين.');
    } else if (field.attr('type') === 'email') {
      feedback.text('يرجى إدخال بريد إلكتروني صحيح.');
    } else if (field.attr('type') === 'password') {
      feedback.text('كلمة المرور يجب ألا تقل عن 6 خانات.');
    } else {
      feedback.text('يرجى إدخال بيانات صحيحة في حقل ' + label);
    }
    field.toggleClass('is-invalid', !correct);
    return correct;
  }

  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showToast(title, message) {
    $('#toastTitle').text(title);
    $('#toastMsg').text(message);
    var toast = new bootstrap.Toast(document.getElementById('simpleToast'), { delay: 3500 });
    toast.show();
  }

  // التحقق من نماذج التواصل والدخول وإنشاء الحساب
  var forms = {
    contactForm: [
      ['#cName', 3], ['#cEmail', 'email'], ['#cMsg', 5], ['#cType', 'select']
    ],
    loginForm: [['#loginEmail', 'email'], ['#loginPass', 6]],
    regForm: [
      ['#regName', 3], ['#regEmail', 'email'],
      ['#regPass', 6], ['#regPassConfirm', 'confirm']
    ]
  };

  $('form').submit(function (event) {
    var rules = forms[this.id];
    if (!rules) return;
    event.preventDefault();
    var valid = true;
    for (var i = 0; i < rules.length; i++) {
      var value = $(rules[i][0]).val() || '';
      var rule = rules[i][1];
      var correct = rule === 'email' ? validEmail(value.trim()) :
        rule === 'select' ? value !== '' :
        rule === 'confirm' ? value !== '' && value === $('#regPass').val() :
        value.trim().length >= rule;
      if (!checkField(rules[i][0], correct)) valid = false;
    }
    if (!valid) return;
    if (this.id === 'contactForm') {
      showToast('تم إرسال رسالتك بنجاح!', 'شكراً لتواصلك مع إيلارا، سنرد عليك قريباً.');
      this.reset();
    } else if (this.id === 'loginForm') {
      showToast('تم تسجيل الدخول بنجاح!', 'أهلاً بك مجدداً في بوابة إيلارا.');
      setTimeout(function () { window.location.href = '../index.html'; }, 1000);
    } else {
      showToast('تم إنشاء الحساب بنجاح!', 'مرحباً بك كشريك جديد في إيلارا.');
      this.reset();
    }
  });
});
