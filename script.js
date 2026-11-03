(function () {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");

    function setMenu(open) {
        if (!toggle || !nav) return;
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    }

    if (toggle && nav) {
        toggle.addEventListener("click", function (event) {
            event.stopPropagation();
            setMenu(!nav.classList.contains("is-open"));
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                setMenu(false);
            });
        });

        document.addEventListener("click", function (event) {
            if (!nav.classList.contains("is-open")) return;
            if (nav.contains(event.target) || toggle.contains(event.target)) return;
            setMenu(false);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && nav.classList.contains("is-open")) {
                setMenu(false);
                toggle.focus();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) setMenu(false);
        });
    }

    const form = document.querySelector("#form-contato");
    if (!form) return;

    const status = document.querySelector("#form-status");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = form.nome.value.trim().replace(/\s+/g, " ");
        const email = form.email.value.trim();
        const mensagem = form.mensagem.value.trim();

        form.nome.setCustomValidity(nome ? "" : "Informe seu nome.");
        form.email.setCustomValidity("");
        if (!email) form.email.setCustomValidity("Informe seu e-mail.");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            form.email.setCustomValidity("Informe um e-mail válido.");
        }
        form.mensagem.setCustomValidity(mensagem ? "" : "Escreva uma mensagem.");

        const invalid = [form.nome, form.email, form.mensagem].find(function (field) {
            return !field.checkValidity();
        });
        if (invalid) {
            if (status) {
                status.textContent = invalid.validationMessage;
                status.classList.add("is-error");
            }
            invalid.focus();
            return;
        }

        form.nome.value = nome;
        form.email.value = email;
        form.mensagem.value = mensagem;

        const subject = encodeURIComponent("Contato pelo portfólio — " + nome);
        const body = encodeURIComponent("Nome: " + nome + "\nE-mail: " + email + "\n\n" + mensagem);
        const mailto = "mailto:richard.ricfritz@gmail.com?subject=" + subject + "&body=" + body;
        if (mailto.length > 1900) {
            if (status) {
                status.textContent = "A mensagem ficou longa demais para o aplicativo de e-mail. Encurte o texto ou escreva direto para richard.ricfritz@gmail.com.";
                status.classList.add("is-error");
            }
            form.mensagem.focus();
            return;
        }

        if (status) {
            status.textContent = "O aplicativo de e-mail vai abrir com a mensagem pronta.";
            status.classList.remove("is-error");
        }
        window.location.href = mailto;
    });

    form.addEventListener("input", function (event) {
        if (event.target && event.target.setCustomValidity) {
            event.target.setCustomValidity("");
        }
        if (status) {
            status.textContent = "";
            status.classList.remove("is-error");
        }
    });
})();
