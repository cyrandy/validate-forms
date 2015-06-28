NODEBIN := ./node_modules/.bin

test:
	$(NODEBIN)/testem -f testem.json

clean:
	rm -rf *.log dist

silent:
	@:

.PHONY: silent clean dependency testci test lint dev
