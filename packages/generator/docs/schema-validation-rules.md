## Требования к схеме

При несоответствии схемы правилам описанным далее - рендеринг формы невозможен (показать компонент ошибки + вызвать коллбэк ошибки) 

1. У всех компонентов type=dynamic-container:
1.1. Должна быть только одна RootNode
1.2. RootNode должна быть type=container


2. все значение layout свыше maxColSpan будут превидены к maxColSpan

