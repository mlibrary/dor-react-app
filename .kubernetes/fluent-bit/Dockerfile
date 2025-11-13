FROM fluent/fluent-bit:4.0.8

WORKDIR /fluent-bit

COPY ./fluent-bit.conf /fluent-bit/etc/fluent-bit.conf
COPY ./parsers.conf /fluent-bit/etc/parsers.conf

CMD ["/fluent-bit/bin/fluent-bit", "-c", "/fluent-bit/etc/fluent-bit.conf"]
