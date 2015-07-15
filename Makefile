NODEBIN := ./node_modules/.bin

build:
	$(NODEBIN)/babel -d lib src

test:
	$(NODEBIN)/testem -p 7358 -f testem.json

testci:
	$(NODEBIN)/testem ci -p 7358 -f testem.json

clean:
	rm -rf *.log dist

silent:
	@:

.PHONY: silent clean testci test build
